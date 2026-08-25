from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response


from .models import User

from .serializers import (
    RegisterSerializer,
    AccountSerializer,
    PasswordChangeSerializer,
)






class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer




class AccountView(generics.RetrieveAPIView):  # データを1件取得するAPIを作るという意味。「ユーザー1人分の情報」を取得したいから RetrieveAPIView。

    serializer_class = AccountSerializer    # 取得したUserを、AccountSerializer でJSONに変換する。
    permission_classes = [IsAuthenticated]  # JWTでログインしているユーザーだけ、このAPIを使えるようにする。

    def get_object(self):
        return self.request.user



# パスワード変更というAPIを自分で処理
class PasswordChangeView(APIView):

    permission_classes = [IsAuthenticated]


    def post(self, request):

        # serializerにデータを渡す
        serializer = PasswordChangeSerializer(
            data=request.data,   # request.data: ユーザーが送ってきたデータ。　ex) { "current_password": "old123","new_password": "new456" }
            context={   # context: Serializerに「追加で渡しておく情報の箱」。これにより、serializerに、self.context["request"].userを書くことで、serializer側で、ログイン中のユーザーを取得できる。
                "request": request
            }
        )

        #  serializerに書いた、validate_current_password() と validate_new_password()が実行される。
        serializer.is_valid(raise_exception=True)


        user = request.user

        user.set_password(   # set_password() がハッシュ化してくれる。
            serializer.validated_data["new_password"]   # serializerによるチェックを全部通過した、新しいパスワードのこと。Serializerからチェック済みのデータを、Viewが受け取っている。
        )

        user.save()   # DBに保存。


        return Response(
            {
                "detail": "パスワードを変更しました。"
            },
            status=status.HTTP_200_OK
        )
