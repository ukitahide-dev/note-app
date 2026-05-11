from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Note
from .serializers import NoteSerializer



class NoteViewSet(ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  # ログイン済みのユーザーだけ許可する


    def get_queryset(self):  # get_querysetは、どのデータを返すか決める
        return Note.objects.filter(user=self.request.user)


    def perform_create(self, serializer):  # perform_createは、POSTされたときに保存処理をカスタムする場所
        serializer.save(user=self.request.user)  # ノート作成時にサーバー側で自動で user を付ける。フロントからのなりすましを防ぐ。





