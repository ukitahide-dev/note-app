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
    labels = LabelSerializer(
        many=True,
        read_only=True  # レスポンス専用（GET用）。Labelをネストして返す。1つのNoteにLabelは複数あるから。
    )


    # 保存用
    label_ids = serializers.PrimaryKeyRelatedField(  # PrimaryKey(id)を使って関連Modelを取得するField。フロントから渡ってきたlabelId(数字)の配列を、Labelオブジェクトに変換する。[<Label id=1>, <Label id=2>]
        many=True,  # 複数id受け取る
        queryset=Label.objects.all(),
        source="labels",  # label_ids という名前で受け取るけど、実際に保存する先はNote.labelsという意味。
        write_only=True,  # リクエスト専用（POST / PUT用）。
        required=False
    )



    # Noteモデルにはimagesカラムは無いけど、レスポンスにはimagesという項目を追加して返して、という意味。
    images = NoteImageSerializer(  # imagesという名前は、NoteImageModelのnoteカラムに書いた、related_name="images"と同じにする必要がある。
        many=True,
        read_only=True
    )



    class Meta:
        model = Note
        fields = '__all__'  # Noteモデルの全フィールド(カラム)をSerializerで扱います、という意味。
        read_only_fields = ["user"]  # userは読み取り専用にする。これがないと、フロントからuserを送信しない場合、エラーになる。


        # extra_kwargs: 生成されたSerializerフィールドに追加設定するという意味。既存のDRFフィールドの設定を変更する。DRFが自動的に作った title と content のフィールドについて、標準のエラーメッセージをこの文章に変更してという意味。これで、標準で用意されている、英語のエラーメッセージじゃなくなる。
        extra_kwargs = {

            "title": {  # NoteSerializerの title フィールドに対する設定という意味。

                "error_messages": {
                    "blank": "タイトルを入力してください。",
                    "required": "タイトルを入力してください。",
                }

            },

            "content": {

                "error_messages": {
                    "blank": "本文を入力してください。",
                    "required": "本文を入力してください。",
                }

            },
        }


    # validate_: 空白だけ禁止など、自分独自のルールを書く場所。自分で追加のチェックをする。
    def validate_title(self, value):   # validate_ + フィールド名、という形がDRFのルール。self は、現在動いている NoteSerializer 自身。value には、フロントから送られてきた、titleフィールドの値が入る。
        value = value.strip()

        print("titleのvalue:", value)

        if not value:
            raise serializers.ValidationError(
                "タイトルを入力してください。!!!!!!!"
            )

        return value



    def validate_content(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "本文を入力してください。"
            )

        return value




    def validate_label_ids(self, value):  # selfは今動いているserializer自身。ここでは、NoteSerializerのこと。
        user = self.context["request"].user  # contextはserializerに渡される追加情報。ログイン中のユーザーを取得。

        for label in value:
            if label.user != user:
                raise serializers.ValidationError("他人のラベルは使えません")

        return value   # validationを通過した値をDRFへ返す。





class NoteHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteHistory
        fields = "__all__"










