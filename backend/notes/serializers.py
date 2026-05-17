from rest_framework import serializers
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ["user"]  # userは読み取り専用にする。これがないと、フロントからuserを送信しない場合、エラーになる。


