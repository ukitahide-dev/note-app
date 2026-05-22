from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Note
from .serializers import NoteSerializer

from rest_framework.decorators import action
from rest_framework.response import Response




class NoteViewSet(ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # ログイン済みのユーザーだけ許可する


    def get_queryset(self):  # get_querysetは、どのデータを返すか決める。ViewSetが対象データを探す時の基準として使われる。
        if self.action in [
            "partial_update",
            "update",
            "destroy",
        ]:  # self.actionはDRFのViewSetが今どの操作を実行してるかを表す値
            return Note.objects.filter(user=self.request.user)

        return Note.objects.filter(user=self.request.user, is_deleted=False)




    def perform_create(self, serializer):  # perform_createは、POSTされたときに保存処理をカスタムする場所
        serializer.save(user=self.request.user)  # ノート作成時にサーバー側で自動で user を付ける。フロントからのなりすましを防ぐ。




    @action(detail=False, methods=["get"])
    def trash(self, request):  # /notes/trash/へアクセスされたとき、この関数を実行する
        notes = Note.objects.filter(user=request.user, is_deleted=True)
        serializer = self.get_serializer(notes, many=True)

        return Response(serializer.data)


