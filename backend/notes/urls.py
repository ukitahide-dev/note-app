from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, LabelViewSet

router = DefaultRouter()
router.register('notes', NoteViewSet, basename='note')
router.register("labels", LabelViewSet)



urlpatterns = router.urls
