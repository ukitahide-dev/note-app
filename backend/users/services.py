from datetime import timedelta

from django.utils import timezone
# from rest_framework import serializers

from .models import EmailChangeRequest


# メールアドレス変更処理専用の例外。
class EmailChangeError(Exception):
    pass



# 確認tokenを使ってメールアドレス変更を確定するという、このアプリ固有の業務ルール。このメール変更を実行していいか判断して、ダメならアプリ固有のエラーを発生させる。serializers.ValidationErrorでHTTPは使わないようにする。HTTPをするのは、viewの仕事。
def verify_email_change(token):

    try:
        email_change_request = EmailChangeRequest.objects.get(
            token=token
        )
    except EmailChangeRequest.DoesNotExist:
        raise EmailChangeError(
            "確認リンクが無効です。"
        )



    expires_at = (
        email_change_request.created_at
        + timedelta(hours=1)
    )


    if timezone.now() > expires_at:
        raise EmailChangeError(
            "確認リンクの有効期限が切れています。"
        )



    user = email_change_request.user

    user.email = email_change_request.new_email
    user.save()

    email_change_request.delete()
