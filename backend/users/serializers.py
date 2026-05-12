from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

        # extra_kwargs は、「fieldsへの追加設定」を意味する。パスワードはwrite（書き込み）だけOKにする。
        extra_kwargs = {
            'password': {'write_only': True}
        }


    def create(self, validated_data):  # validated_data は、バリデーション済みの安全なデータ。
        user = User.objects.create_user(  # create_user は内部でpasswordをハッシュ化してくれる
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user
