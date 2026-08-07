from rest_framework import serializers
from .models import User

from django.contrib.auth.password_validation import django_validate_password









class RegisterSerializer(serializers.ModelSerializer):

    # passwordカラムは自分でカスタマイズして定義するという意味。
    password = serializers.CharField(
        write_only=True,

    )


    class Meta:
        model = User
        fields = ['username', 'email', 'password']






    # passwordフィールドが送られてきた時、この関数が実行される。validate_フィールド名という決まった書き方。今回はpasswordをチェックしたいから、validate_password
    def validate_password(self, value):  # value: フロントから送られてきたパスワードが入る。

        django_validate_password(value)  #  Django標準のパスワードチェック。

        return value  # valueはここではパスワードのこと。チェックは通ったから、この値（パスワード）をそのまま次のSerializer処理へ渡して、という意味。



    def validate_username(self, value):

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "このユーザー名は既に使われています"
            )

        return value



    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "このメールアドレスはすでに登録されています"
            )

        return value


    # 登録OKになったデータを使って、実際にUserをデータベースに作成する処理
    def create(self, validated_data):  # validated_dataは、チェック完了後の安全な入力データ。

        user = User.objects.create_user(   # create_user(): パスワードをハッシュ化してUserを作るDjangoのメソッド。
            **validated_data  # **はvalidate_dataを展開してる。
        )

        return user




