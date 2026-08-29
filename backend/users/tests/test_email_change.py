from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from ..models import User, EmailChangeRequest
from ..services import verify_email_change




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
