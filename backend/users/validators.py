from django.contrib.auth.password_validation import (
    MinimumLengthValidator,
    CommonPasswordValidator,
    NumericPasswordValidator,
    UserAttributeSimilarityValidator,
)


from django.core.exceptions import ValidationError



class JapaneseMinimumLengthValidator(MinimumLengthValidator):  # Djangoが元々持っている MinimumLengthValidator を継承して、自分用のバリデータを作る

    def get_help_text(self):
        return "パスワードは8文字以上で設定してください。"


    def validate(self, password, user=None):
        if len(password) < self.min_length:  # Djangoの親クラス MinimumLengthValidator が持っている「最低文字数」の値

            raise ValidationError(
                "パスワードは8文字以上で設定してください。"
            )



class JapaneseCommonPasswordValidator(CommonPasswordValidator):

    def get_help_text(self):
        return "よく使われるパスワードは使用できません。"

    def validate(self, password, user=None):
        if password.lower().strip() in self.passwords:

            raise ValidationError(
                "よく使われるパスワードは使用できません。"
            )




class JapaneseNumericPasswordValidator(NumericPasswordValidator):

    def get_help_text(self):
        return "数字だけのパスワードは使用できません。"

    def validate(self, password, user=None):
        
        if password.isdigit():

            raise ValidationError(
                "数字だけのパスワードは使用できません。"
            )
