from datetime import timedelta

from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

from django.urls import reverse

from django.utils import timezone

from django.core import mail

from unittest.mock import patch


from ..models import User, EmailChangeRequest

from ..services import (
    verify_email_change,
    EmailChangeError,
)


import uuid




# この業務処理そのものは正しいかをテストする。サービス単体のテストを書く意味: メール変更という業務処理そのものが正しいか直接確認しやすくするため。仮にここでエラーが出たら、サービスの中に原因があると特定できる。
class EmailChangeTest(TestCase):


    # -------- 正常系 ---------

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




    # ------- 異常系 ---------

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









class EmailChangeRequestAPITest(APITestCase):

    def test_email_change_request_success(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )


        # このテストでは、このユーザーがログイン済みという状態にする
        self.client.force_authenticate(
            user=user
        )

        url = reverse("email_change")   # users/urls.pyに書いた、name="email_change"と同じにする。


        response = self.client.post(     # EmailChangeViewにpostリクエストを送る。
            url,
            {
                "current_password": "testpassword123",
                "new_email": "new@example.com",
                "new_email_confirm": "new@example.com",
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


        # EmailChangeRequestがちゃんと1件作られたかを確認。
        self.assertEqual(
            EmailChangeRequest.objects.count(),
            1,
        )



        request = EmailChangeRequest.objects.get()


        # 誰のメール変更リクエストなのか正しく紐づいているかを確認。
        self.assertEqual(
            user,
            request.user,
        )

        # 変更先メールアドレスが正しく保存されたか
        self.assertEqual(
            request.new_email,
            "new@example.com",
        )


        # tokenが生成されているか
        self.assertIsNotNone(
            request.token,
        )




    # 確認メールが本当に送信処理されたかをテストする。
    def test_email_change_request_sends_email(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        url = reverse("email_change")

        response = self.client.post(
            url,
            {
                "current_password": "testpassword123",
                "new_email": "new@example.com",
                "new_email_confirm": "new@example.com",
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(mail.outbox),    # mail.outbox は、テスト中に送信されたメールを入れておく場所。
            1,
        )

        email = mail.outbox[0]   # 送信された1通目のメールを取り出す。


        # 新しいメールアドレス宛に送ったかを確認。
        self.assertEqual(
            email.to,
            ["new@example.com"],
        )


        # 件名が正しいかを確認。
        self.assertEqual(
            email.subject,
            "メールアドレス変更の確認",
        )






    def test_email_change_request_sends_correct_verification_url(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        url = reverse("email_change")

        response = self.client.post(
            url,
            {
                "current_password": "testpassword123",
                "new_email": "new@example.com",
                "new_email_confirm": "new@example.com",
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


        request = EmailChangeRequest.objects.get(
            user=user
        )

        email = mail.outbox[0]

        expected_url = (
            f"http://localhost:5173/account/email/verify/{request.token}"
        )


        self.assertIn(
            expected_url,
            email.body,
        )





    # ------- 異常系 -------

    # 間違った現在のパスワードを送ったら、400になって、EmailChangeRequestも作られないことをテストする。
    def test_email_change_request_wrong_password(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )


        self.client.force_authenticate(
            user=user
        )


        url = reverse("email_change")


        response = self.client.post(
            url,
            {
                "current_password": "wrongpassword",
                "new_email": "new@example.com",
                "new_email_confirm": "new@example.com",
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


        self.assertIn(
            "current_password",
            response.data,
        )


        self.assertIn(
            "現在のパスワードが正しくありません。",
            response.data["current_password"],
        )


        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
        )




    # パスワードが空文字の場合、エラーが起こるかをテストする。
    def test_email_change_request_current_password_required(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )

        url = reverse("email_change")

        response = self.client.post(
            url,
            {
                "current_password": "",
                "new_email": "new@example.com",
                "new_email_confirm": "new@example.com",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "current_password",
            response.data,
        )

        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
        )







    def test_email_change_request_current_password_missing(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        url = reverse("email_change")

        response = self.client.post(
            url,
            {
                "new_email": "new@example.com",
                "new_email_confirm": "new@example.com",
                # current_passwordは意図的に送らない
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "current_password",
            response.data,
        )

        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
        )




    # 新しいメアドと、確認用メアドが不一致の場合、エラーになるかテストする。
    def test_email_change_request_email_mismatch(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )

        url = reverse("email_change")


        response = self.client.post(
            url,
            {
                "current_password": "testpassword123",
                "new_email": "new@example.com",
                "new_email_confirm": "different@example.com",
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


        self.assertIn(
            "new_email_confirm",
            response.data,
        )


        self.assertIn(
            "メールアドレスが一致していません。",
            response.data["new_email_confirm"],    # response.data["new_email_confirm"] は、**「APIから返ってきたエラーのうち、new_email_confirm のエラーだけを取り出している」**という意味。
        )


        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
        )




    # 既に存在するメアドと、同じメアドに変更しようとした場合、エラーが発生するかテストする。
    def test_email_change_request_duplicate_email(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        User.objects.create_user(
            username="otheruser",
            email="used@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        url = reverse("email_change")

        response = self.client.post(
            url,
            {
                "current_password": "testpassword123",
                "new_email": "used@example.com",
                "new_email_confirm": "used@example.com",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "new_email",
            response.data,
        )

        self.assertIn(
            "このメールアドレスはすでに使用されています。",
            response.data["new_email"],
        )

        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
        )







    def test_email_change_request_invalid_email(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )

        url = reverse("email_change")

        response = self.client.post(
            url,
            {
                "current_password": "testpassword123",
                "new_email": "invalid-email",
                "new_email_confirm": "invalid-email",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "new_email",
            response.data,
        )

        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
        )






    def test_email_change_request_new_email_required(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        url = reverse("email_change")

        response = self.client.post(
            url,
            {
                "current_password": "testpassword123",
                "new_email": "",
                "new_email_confirm": "",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "new_email",
            response.data,
        )

        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
        )





    def test_email_change_request_new_email_missing(self):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        url = reverse("email_change")

        response = self.client.post(
            url,
            {
                "current_password": "testpassword123",
                "new_email_confirm": "new@example.com",
                # new_emailは意図的に送らない
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "new_email",
            response.data,
        )

        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
        )







    # ログインしていないユーザーがメアド変更すると、エラーが発生することを確認するテスト。
    def test_email_change_request_unauthenticated(self):

        url = reverse("email_change")

        response = self.client.post(
            url,
            {
                "current_password": "testpassword123",
                "new_email": "new@example.com",
                "new_email_confirm": "new@example.com",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
        )




    # send_mail() が失敗したら、作成した EmailChangeRequest がDBに残らないことを確認するテスト。
    @patch("users.views.send_mail")   # テスト中だけ、本物の send_mail を偽物に差し替える。
    def test_email_change_request_email_send_failure(
        self,
        mock_send_mail,   # 差し替えられた**偽物の send_mail。@patch によって、本物の send_mail() の代わりに用意された偽物。
    ):

        user = User.objects.create_user(
            username="testuser",
            email="old@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        # エラーをわざと発生させる側。mock_send_mail が呼ばれたら、Exceptionを発生させる。このテスト中、偽物の send_mail() が呼ばれたら、わざとエラーを起こしてという意味。send_mail()を呼んだら例外を発生させる。このテスト中だけ、send_mail()を呼んだらわざとエラーを発生させるという指示。
        mock_send_mail.side_effect = Exception("メール送信失敗")   # side_effect は、「この偽物が呼ばれたら、こういうことを起こして」と指定するためのもの。


        url = reverse("email_change")


        # エラーが発生したことを確認する側。この中の処理を実行して、Exceptionが発生することを期待している。
        with self.assertRaises(Exception):

            self.client.post(
                url,
                {
                    "current_password": "testpassword123",
                    "new_email": "new@example.com",
                    "new_email_confirm": "new@example.com",
                },
                format="json",
            )


        # メール送信に失敗したので、EmailChangeRequestはDBに残っていないことを確認
        self.assertEqual(
            EmailChangeRequest.objects.count(),
            0,
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





