from django.db import models
from django.contrib.auth.models import AbstractUser

from django.conf import settings
import uuid




# 現在確定しているユーザー情報。
class User(AbstractUser):  # AbstractUser: Django標準のUserを継承する。

    email = models.EmailField(unique=True)
    token_version = models.PositiveIntegerField(default=0)   # パスワード変更時に、accessTokenを無効化するために必要。

    USERNAME_FIELD = "email"  # ログイン時はusernameではなくemailを使う
    REQUIRED_FIELDS = ["username"]  # createsuperuser コマンド用。



    def __str__(self):
        return self.email  # 管理画面などで表示される名前。





# まだ確定していないメールアドレス変更を、一時的に保存しておく場所。
class EmailChangeRequest(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    new_email = models.EmailField()

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )
