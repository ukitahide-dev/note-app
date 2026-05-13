from django.urls import path
from .views import RegisterView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)


urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),  # viewやserializerをTokenObtainPairView.as_view()が内部で勝手にやってくれる。私は、loginにアクセスする処理を書くだけで済む。authApi.tsxに書いてる。
    path('token/refresh/', TokenRefreshView.as_view()),
    path('logout/', TokenBlacklistView.as_view()),


]
