from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed




# 認証が必要なAPIにリクエストが来たとき、Django REST Framework（DRF）の認証処理から自動的に呼ばれる。settings.pyに、これ使うことを書く必要がある。
class VersionedJWTAuthentication(JWTAuthentication):    #  SimpleJWTの標準認証を継承して、自分のチェックを追加する。

    # SimpleJWTが検証済みにしたJWTを受け取って、そのJWTに書かれているユーザーを取得し、さらに自分でtoken_versionも確認する。
    def get_user(self, validated_token):   #  validated_token: Authorizationヘッダーから渡されたJWTを、SimpleJWTが検証したあとにできる中身を取り出したもの。

        user = super().get_user(validated_token)    # SimpleJWTに、「このJWTのユーザーを取得して」とお願い。

        token_version = validated_token.get("token_version")

        if token_version != user.token_version:
            raise AuthenticationFailed(
                "このログイン情報は無効になっています。"
            )

        return user
