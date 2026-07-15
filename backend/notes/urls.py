from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import NoteViewSet, LabelViewSet, NoteImageViewSet

router = DefaultRouter()
router.register('notes', NoteViewSet, basename='note')
router.register("labels", LabelViewSet, basename='label')



note_router = routers.NestedDefaultRouter(  # NestedDefaultRouter: 親子関係を持ったRouterを作るという意味
    router,   # 親となるDefaultRouter。router = DefaultRouter()のこと。
    "notes",  # notesの下に子Routerを作る
    lookup="note"  # Viewでは self.kwargs["note_pk"] として取得できる。

)


#  /notes/<note_pk>/images/ にアクセスされたら NoteImageViewSet を使って処理してという意味。
note_router.register(
    "images",  # URLの最後の部分を決めている。 ex)  /api/notes/24/images/
    NoteImageViewSet,  # このURLにアクセスされたら、このViewSetを実行。
    basename="note-images"
)



urlpatterns = router.urls + note_router.urls




# DefaultRouterが自動で生成するurl ex)

# GET    /api/notes/
# POST   /api/notes/

# GET    /api/notes/24/
# PATCH  /api/notes/24/
# DELETE /api/notes/24/

# GET    /api/labels/
# POST   /api/labels/
