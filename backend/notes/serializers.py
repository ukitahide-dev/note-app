from rest_framework import serializers
from .models import Note, Label, NoteHistory, NoteImage




class LabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Label
        fields = [
            "id",
            "name",
            "user",
        ]

        read_only_fields = ["user"]  # userは読み取り専用にする。クライアントからuserを指定させず、View側でログイン中のユーザーを設定するため。perform_create()でserializer.save(user=request.user)として保存する。userはクライアントから入力させず、サーバー側で設定するフィールドにする。




    def validate_name(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "ラベル名を入力してください。"
            )

        return value



class NoteImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = NoteImage    # このSerializerは NoteImage モデルを対象にする。
        fields =  [
            "id",
            "note",
            "image",
            "order",
        ]

        read_only_fields=["note"]  # NoteImageViewSetのperform_create内で対象のnoteをAPIのurlから取得しているから、フロントからnoteを送らせないようにする。




class NoteSerializer(serializers.ModelSerializer):   # 基本的なバリデーションは ModelSerializer が自動でやってくれる。必要になったら validate_フィールド名() を追加する。

    # 表示用
    labels = LabelSerializer(  # Serializerのフィールド名と、Noteモデルの参照先の名前が"labels" で一致しているため、sourceは不要。Serializer側の名前をlabels_listなどに変える場合は、source="labels"を指定してNoteモデルのlabelsを参照する。
        many=True,
        read_only=True  # labelsは読み取り専用。フロントからの入力としては受け付けず、SerializerがNoteをJSONに変換するときに使う。このフィールドは入力データとしては使わず、出力するときに使う。Labelをネストして返す。1つのNoteにLabelは複数あるから。
    )


    # 保存用  このSerializerでは、label_idsという入力を受け取ったら、PrimaryKeyRelatedFieldとして扱うという設定。
    label_ids = serializers.PrimaryKeyRelatedField(   # APIでは"label_ids"という名前で入力を受け取るが、source="labels"によって、Serializer内部では"labels"として扱う。そのため、is_valid()後のvalidated_dataでは{"labels": [Labelオブジェクト, ...]} という形になる。APIで受け取る名前を label_ids にする。フロントから、{ "label_ids": [1, 3, 5] } を受け取れるようにしている。PrimaryKey(id)を使って関連Modelを取得するField。フロントから渡ってきたlabelId(数字)の配列を、Labelオブジェクトに変換する。[<Label id=1>, <Label id=2>]

        many=True,  # 複数id受け取る  ex) { "label_ids": [1, 3, 5] }
        queryset=Label.objects.all(),  # queryset=Label.objects.all(): 渡されたIDをどこから探すか。Labelモデルから探す。受け取ったIDが、本当に存在するLabelなのか確認する。存在する → Labelオブジェクトに変換。存在しない → バリデーションエラー。
        source="labels",  # APIでは label_ids という名前で受け取るけど、Serializer内部ではNoteモデルの labels というフィールドに対応させる。label_ids という名前で受け取るけど、実際に保存する先はNote.labelsという意味。
        write_only=True,  # label_idsは書き込み用。リクエストで受け取ってNote.labelsを更新するために使う。レスポンスには出さない。
        required=False
    )



    # Noteモデルにはimagesカラムは無いけど、レスポンスにはimagesという項目を追加して返して、という意味。images が Note モデルのカラムに存在しなくても、Serializerに宣言すればレスポンスに含められる。
    images = NoteImageSerializer(  # NoteモデルにimagesというDBカラムがあるわけではない。NoteImage.noteのrelated_name="images"によって、Noteインスタンスからnote.imagesで関連するNoteImageを取得できる。Serializerのフィールド名を"images"にしているため、sourceを指定しなくてもnote.imagesを参照できる。フィールド名をimage_listなどに変える場合はsource="images"を指定する。imagesという名前は、NoteImageModelのnoteカラムに書いた、related_name="images"と同じにする必要がある。
        many=True,
        read_only=True
    )



    class Meta:
        model = Note
        fields = [
            "id",
            "user",
            "title",
            "content",
            "labels",
            "label_ids",
            "images",
            "color",
            "view_count",
            "total_view_seconds",
            "is_favorite",
            "is_deleted",
            "is_pinned",
            "created_at",
            "updated_at",
            "deleted_at",
            "order",
            "pinned_order",
        ]
        # fields = '__all__'  # Noteモデルの全フィールドをSerializerのフィールドとして含める。さらに、Serializerで明示的に宣言したlabels、label_ids、imagesも含まれる。Noteモデルの全フィールド(カラム)をSerializerで扱います、という意味。

        read_only_fields = [
            "user",   # userは読み取り専用にする。クライアントからuserを指定させず、View側でログイン中のユーザーを設定するため。perform_create()でserializer.save(user=request.user)として保存する。userはクライアントから入力させず、サーバー側で設定するフィールドにする。
            "view_count",
            "total_view_seconds",
            "deleted_at",
        ]

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
                "タイトルを入力してください。"
            )

        return value



    def validate_content(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "本文を入力してください。"
            )

        return value




    def validate_label_ids(self, value):  # selfは今動いているserializer自身。ここでは、NoteSerializerのこと。value は、[Labelオブジェクト, Labelオブジェクト]。PrimaryKeyRelatedFieldによる変換・検証が済んだ後のデータが入ってる。

        user = self.context["request"].user  # contextはserializerに渡される追加情報。ログイン中のユーザーを取得。

        # print(value)  # [<Label: Label object (20)>, <Label: Label object (5)>, <Label: Label object (2)>]

        for label in value:
            if label.user != user:
                raise serializers.ValidationError("他人のラベルは使えません")

        return value   # validationを通過した値をDRFへ返す。





class NoteReorderSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    order = serializers.IntegerField(min_value=0)





class NotePinnedReorderSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    pinned_order = serializers.IntegerField(min_value=0)






class NoteImageReorderSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    order = serializers.IntegerField(min_value=0)





class NoteHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteHistory
        fields = [
            "id",
            "note",
            "action",
            "created_at",
        ]








class ViewTimeSerializer(serializers.Serializer):
    seconds = serializers.IntegerField(
        min_value=0
    )



