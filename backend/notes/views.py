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
    NoteReorderSerializer,
    NotePinnedReorderSerializer,
)

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from rest_framework.filters import OrderingFilter

from django.db import transaction

from django.utils import timezone

from django.core.files.storage import default_storage
from django.db.models import F

from django.db import models







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
        "total_view_seconds",
        "order",
        "pinned_order",
    ]

    # ordering指定がなかった場合のデフォルト。
    ordering = ["order"]




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

        is_favorite = self.request.query_params.get("is_favorite")

        label_name = self.request.query_params.get("label_name")



        if is_deleted == "true":

            queryset = queryset.filter(
                is_deleted=True
            )

        else:

            queryset = queryset.filter(
                is_deleted=False
            )

            if is_favorite != "true" and not label_name:
                queryset = queryset.filter(
                    is_pinned=False
                )

            if label_name:
                queryset = queryset.filter(
                    labels__name=label_name
                )


        if is_favorite == "true":

            queryset = queryset.filter(
                is_favorite=True
            )

        elif is_favorite == "false":

            queryset = queryset.filter(
                is_favorite=False
            )




        # if is_deleted == "true":
        #     queryset = queryset.filter(
        #         is_deleted=True
        #     )
        # else:
        #     queryset = queryset.filter(
        #         is_deleted=False,
        #         is_pinned=False,
        #     )



        # if is_favorite == "true":
        #     queryset = queryset.filter(is_favorite=True)
        # elif is_favorite == "false":
        #     queryset = queryset.filter(is_favorite=False)




        return queryset   # DRFに候補データを渡す。




    def perform_create(self, serializer):  # perform_createは、POSTされたときに保存処理をカスタムする場所

        last_order = Note.objects.filter(
            user=self.request.user
        ).aggregate(
            max_order=models.Max("order")
        )["max_order"]

        next_order = 0 if last_order is None else last_order + 1

        serializer.save(
            user=self.request.user,   # ノート作成時にサーバー側で自動で user を付ける。フロントからのなりすましを防ぐ。
            order=next_order,
        )





    # Noteを更新する直前に、このアプリ固有のルールだけ追加する。更新するときに、何を追加でやるかを担当する場所。
    def perform_update(self, serializer):  # この時点で、serializerにはバリデーションを通過した安全なデータが入っている。DRF標準のpartial_update()の内部で行われている。対象のNote → serializer.instance。検証済みの変更(リクエスト)内容 → serializer.validated_data。

        print(serializer.validated_data)
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

            super().perform_update(serializer)
            # serializer.save()

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



    # ピン止めノート取得。通常ノートとは違い、pinned_orderを使って並べ替える。ページネーションには含まない。だから、ここで通常ノートとは違う独自の処理を書く。
    @action(detail=False, methods=["get"])
    def pinned(self, request):

        notes = Note.objects.filter(
            user=request.user,
            is_deleted=False,

            is_pinned=True,
        )


        ordering = request.query_params.get(
            "ordering",
            "pinned_order",
        )

        allowed_ordering = [
            "pinned_order",
            "-created_at",
            "created_at",
            "-updated_at",
            "updated_at",
            "title",
            "-view_count",
            "-total_view_seconds",
        ]

        if ordering not in allowed_ordering:
            ordering = "pinned_order"


        notes = notes.order_by(ordering)


        serializer = self.get_serializer(
            notes,
            many=True,
        )

        return Response(serializer.data)





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

        note = get_object_or_404(
            Note.objects.filter(
                user=request.user,
                is_deleted=False,
            ),
            pk=pk,
        )

        # note = self.get_object()   # これだと、get_querysetから対象のノートを探すことになる。今のget_queryset()では、is_pinned=Falseのノートを返す設計にしているから、ピン止めノートを取得できず、ピン止めノートの閲覧数が更新されなくなる。

        note.view_count = F("view_count") + 1  # Pythonで計算するのではなく、「データベースで計算してください」とお願いするための書き方。競合アクセスでカウントが正しく増えなくなることを防ぐ。１
        note.save(update_fields=["view_count"])


        note.refresh_from_db()

        return Response(
            {
                "view_count": note.view_count
            }
        )



    @action(detail=True, methods=["patch"])
    def view_time(self, request, pk=None):


        note = get_object_or_404(
            Note.objects.filter(
                user=request.user,
                is_deleted=False,
            ),
            pk=pk,
        )

        # note = self.get_object()  # Noteインスタンスをnote変数に入れる。python上のNoteインスタンス。

        # seconds = request.data.get("seconds", 0)  # HTTPリクエストのJSONから seconds を取り出して。なかったら0にして。これだと、Viewが直接リクエストデータを扱うことになる。

        serializer = ViewTimeSerializer(   # ユーザーからHTTPで送られてきたデータを、 ViewTimeSerializer に渡している。
            data=request.data
        )

        serializer.is_valid(   # 渡したデータをSerializerに検査させる。
            raise_exception=True
        )


        seconds = serializer.validated_data["seconds"]   # serializerの検査を通過したデータを取り出す。

        note.total_view_seconds = F("total_view_seconds") + seconds   # DBの total_view_seconds にsecondsを足せというF式を、Noteインスタンスの属性に設定。Pythonで、今の値を取得して計算するんじゃなくて、DBの中にある値を使って計算するという意味。DBにある total_view_seconds + seconds。


        note.save(
            update_fields=["total_view_seconds"]  # DBを更新。
        )


        note.refresh_from_db()   # このNoteインスタンスの値を、DBから読み直す。これをしないと、Noteインスタンスnoteのtotal_view_secondsがF式のままになる恐れがある。


        return Response(
            {
                "total_view_seconds": note.total_view_seconds
            }
        )





    @action(detail=False, methods=["patch"], url_path="reorder")
    def reorder(self, request):

        serializer = NoteReorderSerializer(
            data=request.data,
            many=True,
        )

        serializer.is_valid(
            raise_exception=True
        )


        with transaction.atomic():

            for note_data in serializer.validated_data:

                note_id = note_data["id"]
                order = note_data["order"]

                # NoteViewSet の get_queryset() が返したノートの中から、id=note_id のものを探す。これだと、get_querysetの取得条件に依存してしまう。get_querysetはViewSet全体の都合で作られた取得条件。将来的にget_querysetのコードが書き換えられると、それに依存してしまう。
                # note = get_object_or_404(
                #     self.get_queryset(),
                #     id=note_id
                # )

                # def reorderの中で、どんなデータを扱うのかを明示的に書く。
                note = get_object_or_404(
                    Note.objects.filter(
                        user=request.user,
                        is_deleted=False,
                        is_pinned=False,
                    ),
                    id=note_id,
                )


                note.order = order
                note.save(
                    update_fields=["order"]
                )


        return Response(status=status.HTTP_204_NO_CONTENT)




    # ピン止めノートを並び替える
    @action(detail=False, methods=["patch"],url_path="pinned/reorder")
    def reorder_pinned(self, request):

        serializer = NotePinnedReorderSerializer(
            data=request.data,
            many=True,
        )

        serializer.is_valid(raise_exception=True)

        print(serializer.validated_data)


        with transaction.atomic():

            for note_data in serializer.validated_data:

                note_id = note_data["id"]
                pinned_order = note_data["pinned_order"]

                note = get_object_or_404(
                    Note.objects.filter(
                        user=request.user,
                        is_pinned=True,
                        is_deleted=False,
                    ),
                    id=note_id,
                )

                note.pinned_order = pinned_order
                note.save(update_fields=["pinned_order"])


        return Response(status=status.HTTP_204_NO_CONTENT)





class LabelViewSet(ModelViewSet):

    serializer_class = LabelSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        return Label.objects.filter(
            user=self.request.user
        )


    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )




    # 現在存在する（ゴミ箱に入っていない）ノートで実際に使われているラベルだけを取得する処理
    @action(detail=False, methods=["get"])
    def used(self, request):

        # ログイン中のユーザーが作ったラベルのうち、削除されていないノートに使われているラベルだけを取得する
        labels = Label.objects.filter(
            user=self.request.user,
            note__is_deleted=False,
        ).distinct()


        serializer = self.get_serializer(
            labels,
            many=True,
        )


        return Response(
            serializer.data
        )




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

    serializer_class = NoteImageSerializer   # このViewSetでSerializerを使うときは NoteImageSerializerを使う。
    permission_classes = [IsAuthenticated]



    # get_queryset()は、このViewで操作・取得してよいデータの範囲を決める。このViewで扱っていいデータの範囲を決めるためのメソッド。
    def get_queryset(self):  # get_queryset() は GET のためだけのメソッドじゃない。ModelViewSet が「オブジェクトを探す必要がある操作」では全部使われる。

        queryset = NoteImage.objects.filter(
            note__user=self.request.user   # note__user: NoteImageからNoteを辿り、Userを辿る。ログイン中のユーザーが所有しているNoteに紐づいている、レコードを抽出する。
        )

        note_pk = self.kwargs.get("note_pk")   # APIのURLの中に含まれている note_pk という値を、Djangoが self.kwargs から取り出している。URLの設定を、path("notes/<int:note_pk>/images/")のようにする必要がある。


        if note_pk:
            queryset = queryset.filter(
                note__id=note_pk   # 対象のノートIDに属する画像だけを取得する。
            )

        return queryset



    # 対象のノートに、新しく画像を追加する。 ex) POST /api/notes/24/images/ にアクセスすると実行される。HTTPがPOSTの時は、get_queryset()は基本的に実行されない。
    def perform_create(self, serializer):   #  親クラスの perform_createを上書き。perform_create() は「バリデーションが終わった後、実際に保存する直前のカスタマイズ場所」。 serializer は、リクエストデータをNoteImageSerializerに渡して、バリデーションを通過した状態のデータ。NoteImageSerializerのインスタンス。
        # perform_create(self, serializer) に入ってきた時点で、serializer の中にはフロントから送られた image を含むデータが入り、さらに is_valid() を通過している。perform_create(serializer) に来た時点で、フロントから送られて、バリデーションを通過した入力データを持っている。


        note = get_object_or_404(
            Note,
            pk=self.kwargs["note_pk"],   # URLからノートIDを取得する。
            user=self.request.user,
            is_deleted=False,
        )


        last_image = note.images.order_by("-order").first()


        if last_image:
            order = last_image.order + 1
        else:
            order = 0




        #  検証済みの画像データを、note と order を追加して、NoteImageとしてDBに保存してという意味。NoteImageモデルのnoteカラムに、取得したNoteオブジェクトを入れて保存して、という意味。NoteImageモデルに保存することになるのは、NoteImageSerializerで、NoteImageモデルを対象にすると書いているから。
        serializer.save(  # フロントから送られたimageは、すでにserializerに入っている。だから、ここでは書かない。
            note=note,  # 左辺はNoteImageモデルのnoteカラム。保存先をサーバーが指定している。つまり、フロント側からnoteは送らない設計。
            order=order,  # orderもサーバー側で決める。
        )



    # ノートの画像順番を並び替える。
    @action(detail=False, methods=["patch"], url_path="reorder")
    def reorder(self, request, note_pk=None):

        # print(request.data)   # [{'id': 72, 'order': 0}, {'id': 78, 'order': 1}, {'id': 71, 'order': 2}]

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



    def perform_destroy(self, instance):  # 親クラスのperform_destroyを上書き（オーバーライド）。親クラスのperform_destroyではなく、このImageViewSetのperform_destroyを使う。標準の削除処理を自分用に差し替えている。NoteImageモデルからデータを消すだけじゃなく、ファイルから画像を消したいから。instanceにはNoteImageモデルインスタンスが入る。

        image_name = instance.image.name   # 削除対象の画像ファイル名を取得。ex) "note_images/abc.jpg"

        instance.delete()  # NoteImage のDBレコードを削除する


        if image_name and default_storage.exists(image_name):
            default_storage.delete(image_name)   # 実際の画像ファイルを削除。


