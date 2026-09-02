from django.core.mail import send_mail
from django.conf import settings




# パスワード変更成功後、メールで通知する。
def send_password_changed_email(user):

    send_mail(
        subject="パスワード変更のお知らせ",
        message=(
            "パスワードが変更されました。\n\n"
            "この操作に心当たりがない場合は、"
            "すぐにアカウントを確認してください。"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
