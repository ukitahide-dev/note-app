from rest_framework import serializers
from .models import Note, Label




class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = '__all__'



class NoteSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True)  # Labelをネストして返す。1つのNoteにLabelは複数あるから。

    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ["user"]  # userは読み取り専用にする。これがないと、フロントからuserを送信しない場合、エラーになる。


