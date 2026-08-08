from rest_framework import serializers
from .models import User

from django.contrib.auth.password_validation import validate_password as django_validate_password









class RegisterSerializer(serializers.ModelSerializer):

    # このSerializerフィールドには、自動で付いてくるvalidatorを使わないという指定。username や email に unique=True が設定されている場合、DRFは自動的に UniqueValidator を付けるから。そのせいで、エラーメッセージがこうなる。「A user with that username already exists.」
    username = serializers.CharField(
        validators=[],
    )

    email = serializers.EmailField(
        validators=[],
    )

    # passwordカラムは自分でカスタマイズして定義するという意味。
    password = serializers.CharField(
        write_only=True,

    )


    class Meta:
        model = User
        fields = ['username', 'email', 'password']






    # passwordフィールドが送られてきた時、この関数が実行される。validate_フィールド名という決まった書き方。今回はpasswordをチェックしたいから、validate_password
    def validate_password(self, value):  # value: フロントから送られてきたパスワードが入る。


        # DBに保存する前に、Userオブジェクトを作る。一時的なUserオブジェクトを作るため。
        user = User(
            username=self.initial_data.get("username"),  # self.initial_data.get: フロントから送られてきた生のデータ。
            email=self.initial_data.get("email"),
        )



        django_validate_password(
            value,  #  Django標準のパスワードチェック。settings.pyのAUTH_PASSWORD_VALIDATORSに書かれてるやつを全部走らせる。
            user=user,
        )

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




