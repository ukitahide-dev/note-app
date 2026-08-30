from datetime import timedelta

from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

from django.urls import reverse

from django.utils import timezone

from ..models import User, EmailChangeRequest

from ..services import (
    verify_email_change,
    EmailChangeError,
)


import uuid




# この業務処理そのものは正しいかをテストする。サービス単体のテストを書く意味: メール変更という業務処理そのものが正しいか直接確認しやすくするため。仮にここでエラーが出たら、サービスの中に原因があると特定できる。
class EmailChangeTest(TestCase):


    def test_email_change_success(self):

        # テスト専用ユーザーを1人作る。
        user = User.objects.create_user(     # create_user() を使うのは、普段の登録と同じようにパスワードを正しくハッシュ化してUserを作ってくれるから。
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )


        request = EmailChangeRequest.objects.create(
            user=user,
            new_email="new@example.com",
        )



        verify_email_change(request.token)    # ここで、実際に、該当するユーザーのメアドが変更され、DBが更新される。


        user.refresh_from_db()   # DBに保存されている最新のUser情報を読み込む。

        self.assertEqual(
            user.email,
            "new@example.com",
        )


        self.assertFalse(
            EmailChangeRequest.objects.filter(
                token=request.token
            ).exists()
        )




    def test_email_change_invalid_token(self):

        invalid_token = uuid.uuid4()

        with self.assertRaises(EmailChangeError):    # この中の処理を実行すると、EmailChangeError が発生することを期待する。
            verify_email_change(invalid_token)




    def test_email_change_expired_token(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        request = EmailChangeRequest.objects.create(
            user=user,
            new_email="new@example.com",
        )


        request.created_at = timezone.now() - timedelta(hours=2)   # わざと有効期限切れにするためのコード。
        request.save()


        with self.assertRaises(EmailChangeError):
            verify_email_change(request.token)


        # エラーが発生したとして、ユーザーのメアドが変更されていないかを確認する。
        user.refresh_from_db()

        # ユーザーのメアドが変更されていないことを期待する。
        self.assertEqual(
            user.email,
            "old@example.com",
        )





# 外からAPIを叩いたら、ちゃんとシステムが動くか。APIを叩いた結果、本当にシステム全体としてメール変更が完了したかを確認している。ここでエラーが出たら、view、serializer、service、のどこかが壊れているなど原因が複数考えられる。
class EmailChangeVerifyAPITest(APITestCase):

    def test_email_change_verify_success(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )


        request = EmailChangeRequest.objects.create(
            user=user,
            new_email="new@example.com",
        )


        url = reverse("email_change_verify")



        response = self.client.post(
            url,
            {
                "token": str(request.token),
            },
            format="json",
        )



        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


        user.refresh_from_db()

        self.assertEqual(
            user.email,
            "new@example.com"
        )


        self.assertFalse(
            EmailChangeRequest.objects.filter(
                token=request.token
            ).exists()
        )






    def test_email_change_verify_invalid_token(self):

        invalid_token = uuid.uuid4()

        url = reverse("email_change_verify")


        response = self.client.post(
            url,
            {
                "token": str(invalid_token),
            },
            format="json"
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


        self.assertIn(
            "確認リンクが無効です。",
            response.data,
        )





    def test_email_change_verify_expired_token(self):

        user = User.objects.create(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )


        request = EmailChangeRequest.objects.create(
            user=user,
            new_email="new@example.com",
        )


        request.created_at = (
            timezone.now() - timedelta(hours=2)
        )

        request.save()


        url = reverse("email_change_verify")

        response = self.client.post(
            url,
            {
                "token": str(request.token),
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


        self.assertIn(
            "確認リンクの有効期限が切れています。",
            response.data,
        )



        user.refresh_from_db()

        self.assertEqual(
            user.email,
            "old@example.com",
        )




    def test_email_change_verify_token_missing(self):

        url = reverse("email_change_verify")

        response = self.client.post(
            url,
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "token",
            response.data,
        )







    def test_email_change_verify_invalid_token_format(self):

        url = reverse("email_change_verify")

        response = self.client.post(
            url,
            {
                "token": "abc",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "token",
            response.data,
        )
