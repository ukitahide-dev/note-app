# from django.test import TestCase

# from .models import User
# from django.urls import reverse

# from rest_framework import status
# from rest_framework.test import APITestCase




# class RegisterTest(APITestCase):


#      # 正常系
#     def test_register_success(self):

#         url = reverse("register")   # users/urls.pyのname="register"のurlを取得する。register という名前を付けたURLを教えてという意味。

#         data = {
#             "username": "testuser",
#             "email": "test@example.com",
#             "password": "testpassword123",
#         }


#         # テストの中から、登録APIに「このデータでユーザー登録してください」というPOSTリクエストを送る。
#         response = self.client.post(    # self.client: テスト用のHTTPクライアント
#             url,  # /register/が入ってる。つまり、/register/ にPOSTする。
#             data,
#             format="json",   # data をJSON形式のリクエストとして送る。
#         )


#         # 登録APIを呼び出した結果、HTTPステータスコードが201だったか確認している
#         self.assertEqual(
#             response.status_code,
#             status.HTTP_201_CREATED,
#         )

#         self.assertTrue(
#             User.objects.filter(
#                 username="testuser"
#             ).exists()
#         )



#     #  異常系：ユーザー名重複
#     def test_register_duplicate_username(self):

#         User.objects.create_user(
#             username="testuser",
#             email="old@example.com",
#             password="testpassword123"
#         )


#         url = reverse("register")


#         data = {
#             "username": "testuser",
#             "email": "new@example.com",
#             "password": "testpassword123",
#         }


#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )


#         # 「実際に起きた結果」と「期待している結果」が一致しているかを調べる。
#         self.assertEqual(
#             response.status_code,    # 実際にAPIから返ってきたステータス
#             status.HTTP_400_BAD_REQUEST,  # テストで期待しているステータス。今回はエラー400を期待している。
#         )


#         # エラー内容を調べる。今回はusernameのエラーを期待。
#         self.assertIn(
#             "username",
#             response.data,
#         )


#         # DBに同じユーザー名のデータが重複して登録されていないかを調べる。
#         self.assertEqual(
#             User.objects.filter(
#                 username="testuser"
#             ).count(),
#             1,
#         )






#     def test_register_username_required(self):

#         url = reverse("register")

#         data = {
#             "username": "",   # usernameという項目は送っている。でも中身が空。
#             "email": "required@example.com",
#             "password": "testpassword123",
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "username",
#             response.data,
#         )



#         self.assertFalse(
#             User.objects.filter(
#                 email="required@example.com"
#             ).exists()
#         )




#     def test_register_username_missing(self):

#         url = reverse("register")

#         data = {
#             "email": "missingusername@example.com",
#             "password": "testpassword123",
#             # usernameは意図的に送らない
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "username",
#             response.data,
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 email="missingusername@example.com"
#             ).exists()
#         )




#     def test_register_duplicate_email(self):

#         User.objects.create_user(
#             username="olduser",
#             email="test@example.com",
#             password="testpassword123",
#         )


#         url = reverse("register")

#         data = {
#             "username": "newuser",
#             "email": "test@example.com",
#             "password": "testpassword123",
#         }


#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )


#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )


#         self.assertIn(
#             "email",
#             response.data,
#         )


#         self.assertEqual(
#             User.objects.filter(
#                 email="test@example.com"
#             ).count(),
#             1,
#         )



#     def test_register_email_required(self):

#         url = reverse("register")

#         data = {
#             "username": "emailrequired",
#             "email": "",
#             "password": "testpassword123",
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "email",
#             response.data,
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 username="emailrequired"
#             ).exists()
#         )




#     def test_register_email_missing(self):

#         url = reverse("register")

#         data = {
#             "username": "missingemail",
#             "password": "testpassword123",
#             # emailは意図的に送らない
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "email",
#             response.data,
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 username="missingemail"
#             ).exists()
#         )




#     def test_register_invalid_email(self):

#         url = reverse("register")

#         data = {
#             "username": "invalidemail",
#             "email": "invalid-email",
#             "password": "testpassword123",
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "email",
#             response.data,
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 username="invalidemail"
#             ).exists()
#         )




#     def test_register_password_too_short(self):

#         url = reverse("register")

#         data = {
#             "username": "newuser",
#             "email": "new@example.com",
#             "password": "1234567",
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         # assertEqual は「完全一致」を調べる。
#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )


#         # assertIn は「中に含まれているか」を調べる。
#         self.assertIn(
#             "password",
#             response.data,
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 username="newuser"
#             ).exists()
#         )





#         self.assertIn(
#             "パスワードは8文字以上で設定してください。",
#             response.data["password"],
#         )






#     def test_register_password_numeric_only(self):

#         url = reverse("register")

#         data = {
#             "username": "newuser",
#             "email": "new@example.com",
#             "password": "12345678",
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "password",
#             response.data,
#         )


#         self.assertIn(
#             "数字だけのパスワードは使用できません。",
#             response.data["password"],
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 username="newuser"
#             ).exists()
#         )



#     def test_register_common_password(self):

#         url = reverse("register")

#         data = {
#             "username": "newuser",
#             "email": "new@example.com",
#             "password": "password",
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "password",
#             response.data,
#         )


#         self.assertIn(
#             "よく使われるパスワードは使用できません。",
#             response.data["password"],
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 username="newuser"
#             ).exists()
#         )




#     def test_register_password_similar_to_username(self):

#         url = reverse("register")

#         data = {
#             "username": "testuser",
#             "email": "taro@example.com",
#             "password": "testuser",
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "password",
#             response.data,
#         )


#         self.assertIn(
#             "ユーザー名やメールアドレスなどの情報に似すぎているパスワードは使用できません。",
#             response.data["password"],
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 username="testuser"
#             ).exists()
#         )




#     def test_register_password_similar_to_email(self):

#         url = reverse("register")

#         data = {
#             "username": "testuser",
#             "email": "test@example.com",
#             "password": "test@example.com",
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "password",
#             response.data,
#         )

#         self.assertIn(
#             "ユーザー名やメールアドレスなどの情報に似すぎているパスワードは使用できません。",
#             response.data["password"],
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 username="testuser"
#             ).exists()
#         )




#     def test_register_password_is_hashed(self):

#         url = reverse("register")

#         data = {
#             "username": "hashuser",
#             "email": "hash@example.com",
#             "password": "testpassword123",
#         }


#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )


#         self.assertEqual(
#             response.status_code,
#             status.HTTP_201_CREATED,
#         )



#         user = User.objects.get(
#             username="hashuser"
#         )


#         #  DBに平文パスワードがが保存されていないことを確認。
#         self.assertNotEqual(
#             user.password,
#             "testpassword123",
#         )


#         #  ハッシュ化されているけど、正しいパスワードなら認証できることを確認。
#         self.assertTrue(
#             user.check_password("testpassword123")
#         )





#     def test_register_password_required(self):

#         url = reverse("register")

#         data = {
#             "username": "passwordrequired",
#             "email": "passwordrequired@example.com",
#             "password": "",
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "password",
#             response.data,
#         )



#         self.assertFalse(
#             User.objects.filter(
#                 username="passwordrequired"
#             ).exists()
#         )




#     def test_register_password_missing(self):

#         url = reverse("register")

#         data = {
#             "username": "missingpassword",
#             "email": "missingpassword@example.com",
#             # passwordは意図的に送らない
#         }

#         response = self.client.post(
#             url,
#             data,
#             format="json",
#         )

#         self.assertEqual(
#             response.status_code,
#             status.HTTP_400_BAD_REQUEST,
#         )

#         self.assertIn(
#             "password",
#             response.data,
#         )


#         self.assertFalse(
#             User.objects.filter(
#                 username="missingpassword"
#             ).exists()
#         )
