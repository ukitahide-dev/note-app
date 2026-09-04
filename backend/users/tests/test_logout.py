from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from rest_framework_simplejwt.tokens import RefreshToken

from ..models import User

from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken




class LogoutAPITest(APITestCase):


    # ログアウトすると、refresh tokenが、DBにブラックリスト登録されるかを確認するテスト。
    def test_logout_success(self):

        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
        )

        refresh = RefreshToken.for_user(user)


        url = reverse("logout")

        response = self.client.post(
            url,
            {
                "refresh": str(refresh),
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


        # 今送ったRefresh Tokenが、ブラックリストに登録されているか？をDBに確認している。
        self.assertTrue(
            BlacklistedToken.objects.filter(
                token__token=str(refresh),
           ).exists()
        )






    # ------- 異常系 -------



    # ログアウトしたRefresh Tokenを使って、もう一度Access Tokenを発行できないことを確認するテスト。ブラックリストに入ったRefresh Tokenは、本当にもう使えないのかを確認している。
    def test_blacklisted_refresh_token_cannot_be_used(self):

        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
        )

        refresh = RefreshToken.for_user(user)


        logout_url = reverse("logout")

        response = self.client.post(
            logout_url,
            {
                "refresh": str(refresh),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


        refresh_url = reverse("token_refresh")

        response = self.client.post(   # /api/token/refresh/ に「この無効化されたRefresh Tokenを使って、新しいAccess Tokenをください」とお願いしている。
            refresh_url,
            {
                "refresh": str(refresh),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )







    # Refresh Tokenを送らなかった場合、ログアウトできないことを確認するテスト。
    def test_logout_refresh_token_required(self):

        url = reverse("logout")

        response = self.client.post(
            url,
            {},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )







    # 不正なRefresh Tokenを送った場合、エラーになることを確認するテスト。
    def test_logout_invalid_refresh_token(self):

        url = reverse("logout")

        response = self.client.post(
            url,
            {
                "refresh": "invalid-refresh-token",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
