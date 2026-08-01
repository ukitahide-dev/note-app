from django.db import models


from users.models import User



class Label(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(
    #             fields=["name", "user"],
    #             name="unique_label_per_user"
    #         )
        # ]




class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=100)
    content = models.TextField()
    labels = models.ManyToManyField(Label, blank=True)
    color = models.CharField(max_length=20, default="#ffffff")
    view_count = models.PositiveIntegerField(default=0) 
    is_favorite = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]




class NoteHistory(models.Model):
    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name="histories",
    )

    action = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]





class NoteImage(models.Model):
    note = models.ForeignKey(
        Note,
        on_delete=models.CASCADE,
        related_name="images" # Noteモデルから、NoteImageモデルへの逆参照。note.images。
    )

    image = models.ImageField(upload_to="note_images/")
    order = models.PositiveIntegerField(default=0)



    # note.images.all()を実行すると、DRFが自動で、order昇順でデータを取得する。デフォルトの並び順を決めておくため。このモデルは基本的にこの順番で扱う」という意図。
    class Meta:
        ordering = ["order"]
