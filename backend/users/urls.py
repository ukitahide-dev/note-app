from django.urls import path


from .views import (
    RegisterView,
    AccountView,
    PasswordChangeView
)


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)


urlpatterns = [
    path(
        'register/',
        RegisterView.as_view(),
        name="register"
    ),


    path(
        "me/",
        AccountView.as_view(),
        name="account",
    ),

    path(
        "password/change/",
        PasswordChangeView.as_view(),
        name="password_change",
    ),


    # /login/ にアクセスされたら、SimpleJWTが用意している TokenObtainPairView を使ってログイン処理を行う。このURLの名前は login とする。
    path(
        'login/',
        TokenObtainPairView.as_view(),   # SimpleJWTが用意しているJWTログイン用のクラスベースViewを、DjangoのURLに接続している。私は、loginにアクセスする処理を書くだけで済む。authApi.tsxに書いてる。
        name="login"
    ),

    path(
        'token/refresh/',
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        'logout/',
        TokenBlacklistView.as_view(),   # Simple JWTが用意しているrefresh tokenをブラックリストに入れるためのAPI。
        name="logout",
    ),


]
