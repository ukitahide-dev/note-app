from django.shortcuts import render, get_object_or_404

from rest_framework import status, serializers
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Note, Label, NoteHistory, NoteImage
from .serializers import (
    NoteSerializer,
    LabelSerializer,
    NoteHistorySerializer,
    NoteImageSerializer,
    ViewTimeSerializer,
    NoteImageReorderSerializer,
)

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from rest_framework.filters import OrderingFilter

from django.db import transaction

from django.utils import timezone

from django.core.files.storage import default_storage
from django.db.models import F



class NotePagination(PageNumberPagination):
    page_size = 20  # デフォルトは20件。
    page_size_query_param = "page_size"  # /notes/?page=1&page_size=60を受け付けるようになる。
    max_page_size = 120





class NoteViewSet(ModelViewSet):

    serializer_class = NoteSerializer  # このViewSetでは基本的に NoteSerializer を使うという意味。
    permission_classes = [IsAuthenticated]  # ログイン済みのユーザーだけ許可する
    pagination_class = NotePagination


    # このViewSetでは、このフィルター機能を使う。ソート機能。
    filter_backends = [
        OrderingFilter
    ]

    # ユーザーが並び替えに使っていいカラムを指定する。ユーザーには、この5項目についてだけ並び替えを許可したいという設計。
    ordering_fields = [
        "created_at",
        "updated_at",
        "title",
        "view_count",
        "total_view_seconds"
    ]

    # ordering指定がなかった場合のデフォルト。
    ordering = [
        "-created_at"
    ]



    def get_queryset(self):  # get_querysetは、どのデータを返すか決める。ViewSetが対象データを探す時の基準として使われる。

        queryset = Note.objects.filter(
            user=self.request.user
        )


        # 更新・削除の場合は、通常ノート、ゴミ箱ノート、両方を取得できるようにする。
        if self.action in [   # self.actionはDRFのViewSetが今どの操作を実行してるかを表す値。GET /notes/なら、self.action == "list"。GET /notes/123/なら、self.action == "retrieve"。POST /notes/なら、self.action == "create"。PATCH /notes/123/なら、self.action == "partial_update"。PUT /notes/123/なら、self.action == "update"。DELETE /notes/123/なら、self.action == "destroy"。

            "partial_update",
            "update",
            "destroy",
        ]:

            return queryset



        # ゴミ箱かどうか
        is_deleted = self.request.query_params.get("is_deleted")


        if is_deleted == "true":
            queryset = queryset.filter(
                is_deleted=True
            )
        else:
            queryset = queryset.filter(
                is_deleted=False
            )


        is_favorite = self.request.query_params.get("is_favorite")

        if is_favorite == "true":
            queryset = queryset.filter(is_favorite=True)
        elif is_favorite == "false":
            queryset = queryset.filter(is_favorite=False)

        # if is_favorite:
        #     queryset = queryset.filter(
        #         is_favorite=True
        #     )


        return queryset   # DRFに候補データを渡す。




    def perform_create(self, serializer):  # perform_createは、POSTされたときに保存処理をカスタムする場所
        serializer.save(
            user=self.request.user   # ノート作成時にサーバー側で自動で user を付ける。フロントからのなりすましを防ぐ。
        )



    # Noteを更新する直前に、このアプリ固有のルールだけ追加する。
    def perform_update(self, serializer):  # この時点で、serializerにはバリデーションを通過した安全なデータが入っている。DRF標準のpartial_update()の内部で行われている。

        note = serializer.instance  # partial_update()内部で取得された、ノートinstanceを取得している。self.get_object(): PATCH → partial_update()の過程で実行される。URLで指定されたIDのオブジェクトを、get_queryset() の範囲から1件取得する。get_queryset() で許可された範囲から、URLのPKに一致する1件を取得する。ex) PATCH /api/notes/123/　まず、get_queryset()で候補が絞られ、get_object()で、その候補から対象の1件を取得する。srerializer.instanceはそのデータそのもの。

        # note = self.get_object()  # self.get_object(): PATCH → partial_update()の過程で実行される。URLで指定されたIDのオブジェクトを、get_queryset() の範囲から1件取得する。get_queryset() で許可された範囲から、URLのPKに一致する1件を取得する。ex) PATCH /api/notes/123/ まず、get_queryset()で候補が絞られ、get_object()で、その候補から対象の1件を取得する。srerializer.instanceはそのデータそのもの。

        old_title = note.title
        old_content = note.content
        old_color = note.color
        old_is_deleted = note.is_deleted


        # ゴミ箱内のNoteは「復元」だけ許可する。
        if old_is_deleted:

            update_fields = set(serializer.validated_data.keys())

            if update_fields != {"is_deleted"}:
                raise serializers.ValidationError(
                    "ゴミ箱内のノートは復元のみ可能です。"
                )

            if serializer.validated_data["is_deleted"] is not False:
                raise serializers.ValidationError(
                    "ゴミ箱内のノートは復元のみ可能です。"
                )



        with transaction.atomic():

            serializer.save()

            note.refresh_from_db()   #  DBに現在保存されている最新状態を note に読み直す。


            if not old_is_deleted and note.is_deleted:
                note.deleted_at = timezone.now()
                note.save(
                    update_fields=["deleted_at"]
                )

            elif old_is_deleted and not note.is_deleted:
                note.deleted_at = None
                note.save(
                    update_fields=["deleted_at"]
                )


            if old_title != note.title:
                NoteHistory.objects.create(
                    note=note,
                    action="タイトル変更"
                )

            if old_content != note.content:
                NoteHistory.objects.create(
                    note=note,
                    action="内容を変更"
                )

            if old_color != note.color:
                NoteHistory.objects.create(
                    note=note,
                    action="背景色を変更"
                )



    # def partial_update(self, request, *args, **kwargs):

    #     note = self.get_object()  # 更新前のノートを取得

    #     print(request.data)


    #     # 更新前の値を保存
    #     old_title = note.title
    #     old_content = note.content
    #     old_color = note.color
    #     old_is_deleted = note.is_deleted



    #     with transaction.atomic():

    #         # 通常の更新処理。DBを更新する。
    #         response = super().partial_update(request, *args, **kwargs)  # DBを更新。親クラス(ModelViewSet)のpartial_updateを実行して

    #         # 更新後の値を取得
    #         note.refresh_from_db()


    #         # 更新前にゴミ箱にはない、かつ、新しくゴミ箱に移されたノートの場合
    #         if not old_is_deleted and note.is_deleted:
    #             note.deleted_at = timezone.now()
    #             note.save(
    #                 update_fields=["deleted_at"]
    #             )


    #         # DB更新前と、更新後を比較
    #         if old_title != note.title:
    #             NoteHistory.objects.create(  # 左辺のnote、actionはNoteHistoryモデルのカラム名。
    #                 note=note,  # 右辺のnoteは更新後のnote。
    #                 action="タイトル変更"
    #             )


    #         if old_content != note.content:
    #             NoteHistory.objects.create(
    #                 note=note,
    #                 action="内容を変更"
    #             )


    #         if old_color != note.color:
    #             NoteHistory.objects.create(
    #                 note=note,
    #                 action="背景色を変更"
    #             )


        # return response







    # ゴミ箱内のノートを全て取得する
    # @action(detail=False, methods=["get"])
    # def trash(self, request):  # /notes/trash/へアクセスされたとき、この関数を実行する
    #     notes = Note.objects.filter(
    #         user=request.user,
    #         is_deleted=True
    #     ).order_by("-updated_at")


    #     serializer = self.get_serializer(
    #         notes,
    #         many=True
    #     )

    #     return Response(serializer.data)



    # ゴミ箱内のノートを一括削除する
    @action(detail=False,methods=["delete"], url_path="trash/all")
    def empty_trash(self, request):


        image_names = list(
            NoteImage.objects.filter(
                note__user=request.user,
                note__is_deleted=True,
            )
            .values_list("image", flat=True)
        )


        count = Note.objects.filter(  # フロント側で何件削除したかを表示するためにカウントする。
            user=request.user,
            is_deleted=True
        ).count()


        Note.objects.filter(
            user=request.user,
            is_deleted=True
        ).delete()



        for image_name in image_names:
            if image_name and default_storage.exists(image_name):
                default_storage.delete(image_name)


        return Response(
            {
                "deleted_count": count
            }
        )



    # ノート単体の更新履歴を取得する
    @action(detail=True, methods=["get"])
    def history(self, request, pk=None):   # ex) GET /notes/24/history/
        note = self.get_object()  # ex) Note.objects.get(id=24)

        histories = note.histories.all()  # related_name="histories"。NoteモデルからHistoryモデルを逆参照。

        serializer = NoteHistorySerializer(  # このメソッドの中では、NoteHistorySerializerを使うと明示的に指定。
            histories,
            many=True
        )

        return Response(serializer.data)



    # ノートの閲覧数を増やす
    @action(detail=True, methods=["post"])  # detail=True は/notes/24/view/ のように1件のノートに対するAPIという意味。
    def view(self, request, pk=None):
        note = self.get_object()

        note.view_count = F("view_count") + 1  # Pythonで計算する」のではなく、「データベースで計算してください」とお願いするための書き方。競合アクセスでカウントが正しく増えなくなることを防ぐ。１
        note.save(update_fields=["view_count"])  # view_count だけ保存する。閲覧数を1増やしたいだけだから、余計なカラムは更新しないようにする。

        note.refresh_from_db()

        return Response(
            {
                "view_count": note.view_count
            }
        )



    @action(detail=True, methods=["patch"])
    def view_time(self, request, pk=None):

        note = self.get_object()

        # seconds = request.data.get("seconds", 0)  # HTTPリクエストのJSONから seconds を取り出して。なかったら0にして。これだと、Viewが直接リクエストデータを扱うことになる。

        serializer = ViewTimeSerializer(   # ユーザーからHTTPで送られてきたデータを、 ViewTimeSerializer に渡している。
            data=request.data
        )

        serializer.is_valid(   # 渡したデータをSerializerに検査させる。
            raise_exception=True
        )


        seconds = serializer.validated_data["seconds"]   # serializerの検査を通過したデータを取り出す。

        note.total_view_seconds += seconds


        note.save(
            update_fields=["total_view_seconds"]
        )


        return Response(
            {
                "total_view_seconds": note.total_view_seconds
            }
        )




class LabelViewSet(ModelViewSet):
    serializer_class = LabelSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        return Label.objects.filter(user=self.request.user)


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



# --------------------------------------------
# NoteImagesViewSet
#
# ノートに紐づく画像「一覧」を扱うViewSet
# → ノートに属する画像「集合」を操作する
#
# 対象:
# - GET  /notes/{note_id}/images/   （画像一覧取得）
# - POST /notes/{note_id}/images/   （画像追加）
#
# 「画像の集合(Collection)」を操作する。
# --------------------------------------------
class NoteImagesViewSet(ModelViewSet):

    serializer_class = NoteImageSerializer
    permission_classes = [IsAuthenticated]



    # get_queryset()は、このViewで操作・取得してよいデータの範囲を決める。このViewで扱っていいデータの範囲を決めるためのメソッド。
    def get_queryset(self):  # get_queryset() は GET のためだけのメソッドじゃない。ModelViewSet が「オブジェクトを探す必要がある操作」では全部使われる。

        queryset = NoteImage.objects.filter(
            note__user=self.request.user   # note__user: NoteImageからNoteを辿り、Userを辿る。
        )

        note_pk = self.kwargs.get("note_pk")   # APIのURLの中に含まれている note_pk という値を、Djangoが self.kwargs から取り出している。URLの設定を、path("notes/<int:note_pk>/images/")のようにする必要がある。


        if note_pk:
            queryset = queryset.filter(
                note__id=note_pk   # 対象のノートIDに属する画像だけを取得する。
            )

        return queryset



    # 対象のノートに、新しく画像を追加する。 ex) POST /api/notes/24/images/ にアクセスすると実行される。
    def perform_create(self, serializer):   #  親クラスの perform_createを上書き。perform_create() は「バリデーションが終わった後、実際に保存する直前のカスタマイズ場所」。 serializer は、リクエストデータをNoteImageSerializerに渡して、バリデーションを通過した状態のデータ。
        # perform_create(self, serializer) に入ってきた時点で、serializer の中にはフロントから送られた image を含むデータが入り、さらに is_valid() を通過している。perform_create(serializer) に来た時点で、フロントから送られて、バリデーションを通過した入力データを持っている。


        note = get_object_or_404(
            Note,
            pk=self.kwargs["note_pk"],   # URLからノートIDを取得する。
            user=self.request.user,
        )


        # # ex) ログイン中のユーザーの24番のノートを取ってきて、という意味。
        # note = Note.objects.get(
        #     pk=self.kwargs["note_pk"],  # URLからノートIDを取得する。
        #     user=self.request.user
        # )


        last_image = note.images.order_by("-order").first()


        if last_image:
            order = last_image.order + 1
        else:
            order = 0




        #  検証済みの画像データを、note と order を追加して、NoteImageとしてDBに保存してという意味。NoteImageモデルのnoteカラムに、取得したNoteオブジェクトを入れて保存して、という意味。
        serializer.save(  # フロントから送られたimageは、すでにserializerに入っている。だから、ここでは書かない。
            note=note,  # 左辺はNoteImageモデルのnoteカラム。保存先をサーバーが指定している。つまり、フロント側からnoteは送らない設計。
            order=order,  # orderもサーバー側で決める。
        )



    # ノートの画像順番を並び替える。
    @action(detail=False, methods=["patch"], url_path="reorder")
    def reorder(self, request, note_pk=None):

        # print(request.data)  # [{'id': 72, 'order': 0}, {'id': 78, 'order': 1}, {'id': 71, 'order': 2}]

        serializer = NoteImageReorderSerializer(
            data=request.data,
            many=True,
        )

        serializer.is_valid(
            raise_exception=True
        )


        # 複数のDB変更を、途中で失敗したら全部なかったことにしたい。画像0,1だけ並び替えが成功して、2だけ並び替えに失敗した、このような状態を防ぐ。
        with transaction.atomic():

            # 画像の並び順を更新する
            for image_data in serializer.validated_data:

                image_id = image_data["id"]
                order = image_data["order"]


                image = get_object_or_404(   # get_or_404: 対象のデータが存在しない場合、APIとして404を返してくれる。
                    self.get_queryset(),    # get_querysetが呼ばれる(note__user、note__idとかでデータをフィルターする)。
                    id=image_id,
                )

                # image = self.get_queryset().get(   # get_querysetが呼ばれる(note__user、note__idとかでデータをフィルターする)。そのうえで、get(id=image_id)で、データを取得する。get()は条件に合う1件のオブジェクトを取得する。
                #     id=image_id
                # )

                image.order = order

                image.save(
                    update_fields=["order"]
                )


        # 204は「処理は成功したけど返すデータはありません」というHTTPの正式なステータス。画像並び替え後、react側が正しい順序を知っている状態だから、DB更新後の最新データをDjangoから送らなくても良いから、こう書ける。
        return Response(status=status.HTTP_204_NO_CONTENT)






# --------------------------------------------
# ImageViewSet
#
# 画像「1枚」を扱うViewSet
# → 画像「1枚」を操作する
#
# 対象:
# - GET    /note-images/{image_id}/
# - PATCH  /note-images/{image_id}/
# - DELETE /note-images/{image_id}/
#
# 「画像単体(Resource)」を操作する。
# --------------------------------------------
class ImageViewSet(ModelViewSet):
    serializer_class = NoteImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return NoteImage.objects.filter(
            note__user=self.request.user
        )



    def perform_destroy(self, instance):  # 親クラスのperform_destroyを上書き（オーバーライド）。親クラスのperform_destroyではなく、このImageViewSetのperform_destroyを使う。標準の削除処理を自分用に差し替えている。NoteImageモデルからデータを消すだけじゃなく、ファイルから画像を消したいから。

        image_name = instance.image.name   # 削除対象の画像ファイル名を取得。ex) "note_images/abc.jpg"

        instance.delete()  # DBの NoteImage レコードを削除。


        if image_name and default_storage.exists(image_name):
            default_storage.delete(image_name)   # 実際の画像ファイルを削除。


