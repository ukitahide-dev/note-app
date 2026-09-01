from rest_framework import serializers
from .models import User

from django.contrib.auth.password_validation import validate_password as django_validate_password

from django.core.exceptions import ValidationError

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer




class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    # ユーザーのJWTを作るとき、まずSimpleJWT本来のTokenを作ってもらう。そのTokenにUserが持っている token_version を追加して、そのTokenを返すという処理。
    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)   # SimpleJWT本来のJWT作成処理をまず実行して、その結果をくださいという意味。SimpleJWTが本来作るTokenをそのまま利用する。

        token["token_version"] = user.token_version    # SimpleJWTが作ったtokenのtoken_versionキーに、自分のトークンバージョンを設定する。

        return token






class RegisterSerializer(serializers.ModelSerializer):

    # このSerializerフィールドには、自動で付いてくるvalidatorを使わないという指定。username や email に unique=True が設定されている場合、DRFは自動的に UniqueValidator を付けるから。そのせいで、エラーメッセージがこうなる。「A user with that username already exists.」
    username = serializers.CharField(
        validators=[],
    )


    # emailという入力項目をメールアドレス用のSerializerフィールドとして扱う。ただし、自動で追加されるvalidatorは使わない。
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


        django_validate_password(   #  Django標準のパスワードチェック。settings.pyのAUTH_PASSWORD_VALIDATORSに書かれてるやつを全部走らせる。
            value,
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
    def create(self, validated_data):  # validated_dataは、チェック完了後の安全な入力データ。validated_data が作られるのは、バリデーションを全部通過した後。

        user = User.objects.create_user(   # create_user(): パスワードをハッシュ化してUserを作るDjangoのメソッド。
            **validated_data  # **はvalidate_dataを展開してる。
        )

        return user



    # def validate() は、validate_usenameとか、各フィールドチェックでエラーがあると、実行されなくなる。
    # def validate(self, attrs):

        #     print("★★★ validate() 実行 ★★★")

        #     # DBに保存する前に、Userオブジェクトを作る。一時的なUserオブジェクトを作るため。
        #     user = User(
        #         username = attrs.get("username"),
        #         email = attrs.get("email"),
        #     )

        #     try:
        #         django_validate_password(
        #         attrs.get("password"),
        #         user=user,
        #     )

        #     except ValidationError as e:

        #         print("★★★ password error ★★★")
        #         print(e.messages)

        #         raise serializers.ValidationError({
        #             "password": e.messages
        #         })


        #     # django_validate_password(   #  Django標準のパスワードチェック。settings.pyのAUTH_PASSWORD_VALIDATORSに書かれてるやつを全部走らせる。
        #     #     attrs.get("password"),
        #     #     user=user,
        #     # )

        #     return attrs



# DjangoのUserオブジェクトを、APIで返せるJSONの形に変換するため。
class AccountSerializer(serializers.ModelSerializer):   # serializers.ModelSerializer: DjangoのModelを元にして、APIの入力・出力を作るSerializer。

    class Meta:
        model = User
        fields = ["username", "email"]
        read_only_fields = ["username", "email"]




# パスワード変更APIに送られてきたデータを受け取って、チェックする。
class PasswordChangeSerializer(serializers.Serializer):   # serializers.Serializer: APIで受け取るデータの形・ルールを自分で定義するためのSerializer。


    current_password = serializers.CharField(
        write_only=True
    )

    new_password = serializers.CharField(
        write_only=True
    )


    new_password_confirm = serializers.CharField(
        write_only=True
    )



    def validate_current_password(self, value):  # value: フロントから送られてきたcurrent_passwordの値。

        user = self.context["request"].user

        if not user.check_password(value):
            raise serializers.ValidationError(
                "現在のパスワードが正しくありません。"
            )

        return value




    def validate_new_password(self, value):

        user = self.context["request"].user

        django_validate_password(   #  Django標準のパスワードチェック。settings.pyのAUTH_PASSWORD_VALIDATORSに書かれてるやつを全部走らせる。
            value,
            user=user,   # パスワードを検証するときに、このUserオブジェクトを参考情報として渡す。これで、パスワードがユーザー名と似すぎていないかをチェックできる。
        )

        return value




    def validate(self, attrs):

        user = self.context["request"].user


        # 現在のパスワードと同じではないか
        if user.check_password(attrs["new_password"]):
            raise serializers.ValidationError({
                "new_password":
                    "現在のパスワードと同じパスワードには変更できません。"
        })


        # 新しいパスワードと確認用パスワードが一致しているか
        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError({
                "new_password_confirm":
                    "新しいパスワードと一致していません。"
            })




        return attrs













class EmailChangeSerializer(serializers.Serializer):

    current_password = serializers.CharField(
        write_only=True
    )

    new_email = serializers.EmailField(
        write_only=True
    )

    new_email_confirm = serializers.EmailField(
        write_only=True
    )



    def validate_current_password(self, value):

        user = self.context["request"].user

        if not user.check_password(value):   # ログイン中のユーザーが設定しているパスワードと、今回フロントから送られてきたパスワードが一致しているかをチェック。
            raise serializers.ValidationError(
                "現在のパスワードが正しくありません。"
            )

        return value



    # new_email がすでに誰かに使われてないかをチェックする。validate_〇〇 → その項目だけをチェックする。
    def validate_new_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "このメールアドレスはすでに使用されています。"
            )

        return value



    # new_email と new_email_confirm が一致しているかをチェック
    def validate(self, attrs):    # attrs は、各フィールドのバリデーションを通過した値をまとめたもの。validate() は、その attrs を使ってさらに全体のバリデーションを行う。validate() → 複数の項目を組み合わせてチェックする。

        if attrs["new_email"] != attrs["new_email_confirm"]:
            raise serializers.ValidationError({   # DRFが、エラーをHTTPレスポンスにして返す。
                "new_email_confirm": "メールアドレスが一致していません。"
            })

        return attrs    # チェックOKだったので、このデータを次の処理に渡す。





class EmailChangeVerifySerializer(serializers.Serializer):

    token = serializers.UUIDField()
