
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User

from notes.models import Label, Note, NoteHistory, NoteImage

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.cache import cache


# ---- 正常系 ----


# 正常にアカウントを削除できることをテスト。
class AccountDeleteAPITest(APITestCase):

    def setUp(self):   # setUp() は各テストが始まる前に実行される処理
        cache.clear()


    def test_account_delete_success(self):

        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        url = reverse("account_delete")

        response = self.client.delete(
            url,
            {
                "current_password": "testpassword123",
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


        # 本当にDBからユーザーが消えたかを確認
        self.assertFalse(
            User.objects.filter(
                pk=user.pk
            ).exists()
        )





    # Userが削除されたら、関連モデルのデータも削除されることを確認するテスト。
    def test_account_delete_cascades_related_data(self):

            user = User.objects.create_user(
                username="testuser",
                email="test@example.com",
                password="testpassword123",
            )

            label = Label.objects.create(
                name="仕事",
                user=user,
            )

            note = Note.objects.create(
                user=user,
                title="テストノート",
                content="テスト内容",
            )

            note.labels.add(label)   # このノートに、このラベルを付ける。ManyToManyでは「関係を追加する」という意味で .add() を使う。


            history = NoteHistory.objects.create(
                note=note,
                action="ノートを作成",
            )

            image = NoteImage.objects.create(
                note=note,
                image="note_images/test.jpg",
            )



            self.client.force_authenticate(
                user=user
            )


            url = reverse("account_delete")

            response = self.client.delete(
                url,
                {
                    "current_password": "testpassword123",
                },
                format="json",
            )


            self.assertEqual(
                response.status_code,
                status.HTTP_200_OK,
            )


            self.assertFalse(
                User.objects.filter(
                    pk=user.pk
                ).exists()
            )


            self.assertFalse(
                Note.objects.filter(
                    pk=note.pk
                ).exists()
            )


            self.assertFalse(
                Label.objects.filter(
                    pk=label.pk
                ).exists()
            )


            self.assertFalse(
                NoteHistory.objects.filter(
                    pk=history.pk
                ).exists()
            )

            self.assertFalse(
                NoteImage.objects.filter(
                    pk=image.pk
                ).exists()
            )




    # DBの NoteImage レコードだけじゃなく、実際の画像ファイルも削除されることを確認するテスト。
    def test_account_delete_deletes_image_file(self):

        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
        )

        note = Note.objects.create(
            user=user,
            title="テストノート",
            content="テスト内容",
        )


        image_name = default_storage.save(
            "note_images/test.jpg",
            ContentFile(b"test image"),
        )

        image = NoteImage.objects.create(
            note=note,
            image=image_name,
        )


        self.assertTrue(
            default_storage.exists(image_name)
        )


        self.client.force_authenticate(
            user=user
        )


        url = reverse("account_delete")

        response = self.client.delete(
            url,
            {
                "current_password": "testpassword123",
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertFalse(
            NoteImage.objects.filter(
                pk=image.pk
            ).exists()
        )

        self.assertFalse(
            default_storage.exists(image_name)
        )








    # ---- 異常系 ----

    # 間違ったパスワードでは、エラーが発生することをテスト。
    def test_account_delete_wrong_password(self):

        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        url = reverse("account_delete")

        response = self.client.delete(
            url,
            {
                "current_password": "wrongpassword",
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        # ユーザーがDBに残っていることを確認。
        self.assertTrue(
            User.objects.filter(
                pk=user.pk
            ).exists()
        )






    # 未ログイン状態では、アカウント削除できないことを確認するテスト。
    def test_account_delete_unauthenticated(self):

        url = reverse("account_delete")

        response = self.client.delete(
            url,
            {
                "current_password": "testpassword123",
            },
            format="json",
        )


        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )








    # パスワード未入力なら、アカウント削除されないことを確認するテスト。
    def test_account_delete_password_required(self):

        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpassword123",
        )

        self.client.force_authenticate(
            user=user
        )


        url = reverse("account_delete")

        response = self.client.delete(
            url,
            {
                "current_password": "",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertTrue(
            User.objects.filter(
                pk=user.pk
            ).exists()
        )







    def test_account_delete_rate_limit(self):

            user = User.objects.create_user(
                username="testuser",
                email="test@example.com",
                password="testpassword123",
            )

            self.client.force_authenticate(
                user=user
            )


            url = reverse("account_delete")

            for _ in range(5):
                response = self.client.delete(
                    url,
                    {
                        "current_password": "wrongpassword",
                    },
                    format="json",
                )

                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST,
                )
                

            response = self.client.delete(
                url,
                {
                    "current_password": "wrongpassword",
                },
                format="json",
            )

            self.assertEqual(
                response.status_code,
                status.HTTP_429_TOO_MANY_REQUESTS,
            )
