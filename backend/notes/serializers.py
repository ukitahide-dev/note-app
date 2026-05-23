from rest_framework import serializers
from .models import Note, Label




class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = '__all__'
        read_only_fields = ["user"]




class NoteSerializer(serializers.ModelSerializer):

    labels = LabelSerializer(many=True, read_only=True)  # レスポンス専用（GET用）。Labelをネストして返す。1つのNoteにLabelは複数あるから。

    label_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Label.objects.all(),
        source="labels",  # label_ids に入れた値は実際には Note.labels に保存される。
        write_only=True,  # リクエスト専用（POST / PUT用）。
        required=False
    )

    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ["user"]  # userは読み取り専用にする。これがないと、フロントからuserを送信しない場合、エラーになる。


