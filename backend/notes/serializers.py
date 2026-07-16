from rest_framework import serializers
from .models import Note, Label, NoteHistory, NoteImage




class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = '__all__'
        read_only_fields = ["user"]





class NoteImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteImage
        fields =  "__all__"

        read_only_fields=["note"]  # NoteImageViewSetのperform_create内で対象のnoteを取得しているから、フロントからnoteを送らせないようにする。





class NoteSerializer(serializers.ModelSerializer):

    # 表示用
    labels = LabelSerializer(many=True, read_only=True)  # レスポンス専用（GET用）。Labelをネストして返す。1つのNoteにLabelは複数あるから。

    # 保存用
    label_ids = serializers.PrimaryKeyRelatedField(  # PrimaryKey(id)を使って関連Modelを取得するField。フロントから渡ってきたlabelId(数字)の配列を、Labelオブジェクトに変換する。[<Label id=1>, <Label id=2>]
        many=True,  # 複数id受け取る
        queryset=Label.objects.all(),
        source="labels",  # label_ids という名前で受け取るけど、実際に保存する先はNote.labelsという意味。
        write_only=True,  # リクエスト専用（POST / PUT用）。
        required=False
    )



    images = NoteImageSerializer(
        many=True,
        read_only=True
    )



    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ["user"]  # userは読み取り専用にする。これがないと、フロントからuserを送信しない場合、エラーになる。



    def validate_label_ids(self, value):  # selfは今動いているserializer自身。ここでは、NoteSerializerのこと。
        user = self.context["request"].user  # contextはserializerに渡される追加情報。ログイン中のユーザーを取得。

        for label in value:
            if label.user != user:
                raise serializers.ValidationError("他人のラベルは使えません")

        return value  # validationを通過した値をDRFへ返す。





class NoteHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteHistory
        fields = "__all__"










