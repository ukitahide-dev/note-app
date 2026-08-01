from django.shortcuts import render

from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Note, Label, NoteHistory, NoteImage
from .serializers import NoteSerializer, LabelSerializer, NoteHistorySerializer, NoteImageSerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from rest_framework.filters import OrderingFilter

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

    # ユーザーが並び替えに使っていいカラムを指定する。
    ordering_fields = [
        "created_at",
        "updated_at",
        "title",
    ]

    # ordering指定がなかった場合のデフォルト。
    ordering = [
        "-created_at"
    ]



    def get_queryset(self):  # get_querysetは、どのデータを返すか決める。ViewSetが対象データを探す時の基準として使われる。

        if self.action in [
            "partial_update",
            "update",
            "destroy",
        ]:  # self.actionはDRFのViewSetが今どの操作を実行してるかを表す値
            return Note.objects.filter(
                user=self.request.user
            )

        return Note.objects.filter(
            user=self.request.user,
            is_deleted=False,
        )




    def perform_create(self, serializer):  # perform_createは、POSTされたときに保存処理をカスタムする場所
        serializer.save(user=self.request.user)  # ノート作成時にサーバー側で自動で user を付ける。フロントからのなりすましを防ぐ。




    def partial_update(self, request, *args, **kwargs):
        note = self.get_object()  # 更新前のノートを取得

        print(request.data)


        # 更新前の値を保存
        old_title = note.title
        old_content = note.content
        old_color = note.color


        # 通常の更新処理。DBを更新。
        response = super().partial_update(request, *args, **kwargs)  # DBを更新。親クラス(ModelViewSet)のpartial_updateを実行して

        # 更新後の値を取得
        note.refresh_from_db()


        # DB更新前と、更新後を比較
        if old_title != note.title:
            NoteHistory.objects.create(  # 左辺のnote、actionはNoteHistoryモデルのカラム名。
                note=note,  # 右辺のnoteは更新後のnote。
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


        return response







    # ゴミ箱内のノートを全て取得する
    @action(detail=False, methods=["get"])
    def trash(self, request):  # /notes/trash/へアクセスされたとき、この関数を実行する
        notes = Note.objects.filter(user=request.user, is_deleted=True).order_by("-updated_at")

        serializer = self.get_serializer(
            notes,
            many=True
        )

        return Response(serializer.data)



    # ゴミ箱内のノートを一括削除する
    @action(detail=False,methods=["delete"], url_path="trash/all")
    def empty_trash(self, request):

        count = Note.objects.filter(  # フロント側で何件削除したかを表示するためにカウントする。
            user=request.user,
            is_deleted=True
        ).count()


        Note.objects.filter(
            user=request.user,
            is_deleted=True
        ).delete()



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


    # get_queryset()は、このViewで扱っていいデータの範囲を決めるためのメソッド。
    def get_queryset(self):  # get_queryset() は GET のためだけのメソッドじゃない。ModelViewSet が「オブジェクトを探す必要がある操作」では全部使われる。

        queryset = NoteImage.objects.filter(
            note__user=self.request.user   # note__user: NoteImageからNoteを辿り、Userを辿る。
        )

        note_pk = self.kwargs.get("note_pk")

        if note_pk:
            queryset = queryset.filter(
                note__id=note_pk
            )

        return queryset



    # ex) POST /api/notes/24/images/ にアクセスすると実行される。
    def perform_create(self, serializer):   #  perform_create: 保存する直前に何かしたいならここに書いて、というメソッド。

        # ex) ログイン中のユーザーの24番のノートを取ってきて、という意味。
        note = Note.objects.get(
            pk=self.kwargs["note_pk"],  # URLからノートIDを取得する。
            user=self.request.user
        )


        last_image = note.images.order_by("-order").first()


        if last_image:
            order = last_image.order + 1
        else:
            order = 0




        #  NoteImageモデルのnoteカラムに、取得したNoteオブジェクトを入れて保存して、という意味。
        serializer.save(
            note=note,  # 左辺はNoteImageモデルのnoteカラム。保存先をサーバーが指定している。つまり、フロント側からnoteは送らない設計。
            order=order,  # orderもサーバー側で決める。
        )



    @action(detail=False, methods=["patch"], url_path="reorder")
    def reorder(self, request, note_pk=None):
        print(request.data)


        # 画像の並び順を更新する
        for image_data in request.data:

            image_id = image_data["id"]
            order = image_data["order"]

            image = self.get_queryset().get(   # get_querysetが呼ばれる(note__user、note__idとかでデータをフィルターする)。そのうえで、id=image_idでデータを取得する。
                id=image_id
            )

            image.order = order
            image.save()



        images = self.get_queryset()  # QuerySetを取得し、imagesという変数に保存。


        # NoteImageオブジェクトをJSONに変換する準備をして、という意味
        serializer = NoteImageSerializer(
            images,  # 上で取得した、images QuerySetを、JSONに変換する。
            many=True
        )


        # return Response(serializer.data)

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



