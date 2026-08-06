from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):  # AbstractUser: Django標準のUserを継承する。


    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"  # ログイン時はusernameではなくemailを使う
    REQUIRED_FIELDS = ["username"]  # createsuperuser コマンド用。



    def __str__(self):
        return self.email  # 管理画面などで表示される名前。
