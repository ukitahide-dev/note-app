from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from django.utils import timezone
from datetime import timedelta

from django.core.mail import send_mail
from django.db import transaction

from django.core.files.storage import default_storage   # Djangoが現在使っているファイル保存場所を操作するためのもの


from rest_framework_simplejwt.token_blacklist.models import (
    OutstandingToken,
    BlacklistedToken,
)


from rest_framework_simplejwt.views import TokenObtainPairView





from .services import (
    verify_email_change,
    EmailChangeError,
)



from notes.models import NoteImage


from .models import (
    User,
    EmailChangeRequest,
)


from .serializers import (
    RegisterSerializer,
    AccountSerializer,
    PasswordChangeSerializer,
    EmailChangeSerializer,
    EmailChangeVerifySerializer,
    MyTokenObtainPairSerializer,
    AccountDeleteSerializer,
)



from .emails import (
    send_password_changed_email,
    send_account_deleted_email,
)

from .throttles import (
    PasswordChangeThrottle,
    AccountDeleteThrottle,
)



class MyTokenObtainPairView(TokenObtainPairView):

    serializer_class = MyTokenObtainPairSerializer




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
    throttle_classes = [PasswordChangeThrottle]


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


        with transaction.atomic():

            # パスワードを変更
            user.set_password(    # set_password() がハッシュ化してくれる。
                serializer.validated_data["new_password"]   # serializerによるチェックを全部通過した、新しいパスワードのこと。Serializerからチェック済みのデータを、Viewが受け取っている。
            )

            user.token_version += 1
            user.save()

            # このユーザーの既存Refresh Tokenをすべて無効化。このユーザーに発行済みのRefresh Tokenを全部取り出して、1個ずつブラックリストに入れる。
            for token in OutstandingToken.objects.filter(user=user):

                BlacklistedToken.objects.get_or_create(
                    token=token
                )


        send_password_changed_email(user)


        return Response(
            {
                "detail": "パスワードを変更しました。"
            },
            status=status.HTTP_200_OK
        )






# メールアドレス変更を申し込む
class EmailChangeView(APIView):

    permission_classes = [IsAuthenticated]


    def post(self, request):

        serializer = EmailChangeSerializer(
            data=request.data,  # request.data: フロントから送られてきたデータ。ex) {password: 123, }
            context={
                "request": request,
            }
        )

        serializer.is_valid(raise_exception=True)


        with transaction.atomic():   # DB処理をひとまとまりにして、途中で例外が起きたらDBの変更をロールバックする。この中で行うDB処理を、ひとまとまりとして扱う。


            # バリデーションが全部成功したら、EmailChangeRequestをDBに1件作る。tokenはDjango側で自動生成される。
            email_change_request = EmailChangeRequest.objects.create(
                user=request.user,
                new_email=serializer.validated_data["new_email"],
            )


            token = email_change_request.token


            verification_url = (
                f"http://localhost:5173/account/email/verify/{token}"
            )


            send_mail(
                subject="メールアドレス変更の確認",   # 件名
                message=(   # 本文
                    "メールアドレス変更の確認です。\n\n"
                    "以下のリンクをクリックして、"
                    "メールアドレスの変更を完了してください。\n\n"
                    f"{verification_url}\n\n"
                    "このリンクの有効期限は1時間です。"
                ),
                from_email=None,
                recipient_list=[
                    email_change_request.new_email,
                ],
            )



        return Response(
            {
                "message": "確認メールを送信しました。"
            },
            status=status.HTTP_200_OK,
        )







# 確認トークンをチェックして、メールアドレス変更を確定する
class EmailChangeVerifyView(APIView):

    # permission_classes = [IsAuthenticated]   確認メールを受け取ってリンクをクリックできるかどうかを確認したいから、ログインしているという状態は不要。

    def post(self, request):

        serializer = EmailChangeVerifySerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        token = serializer.validated_data["token"]   # フロントから送信されたtokenを取得。


        try:
            verify_email_change(token)

        except EmailChangeError as e:
            raise serializers.ValidationError(str(e))



        return Response({
            "message": "メールアドレスを変更しました。"
        })





# アカウント削除
class AccountDeleteView(APIView):

    permission_classes = [IsAuthenticated]
    throttle_classes = [AccountDeleteThrottle]


    def delete(self, request):

        serializer = AccountDeleteSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)


        user = request.user
        email = user.email


        image_names = list(    # image_names: ex) [ "note_images/a.jpg", "note_images/b.jpg", "note_images/c.jpg"]
            NoteImage.objects
            .filter(note__user=user)  # __: Django ORMで関連モデルをたどるための記法
            .values_list("image", flat=True)
        )



        with transaction.atomic():

            user.delete()


        # 実際の画像ファイルも削除する。
        for image_name in image_names:

            if image_name and default_storage.exists(image_name):

                default_storage.delete(image_name)


        send_account_deleted_email(email)


        return Response(
            {"detail": "アカウントを削除しました。"},
            status=status.HTTP_200_OK,
        )


