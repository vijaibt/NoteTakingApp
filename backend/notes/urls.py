from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, get_connected_notes

router = DefaultRouter()
router.register(r'notes', NoteViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('notes/<int:note_id>/connections/', get_connected_notes, name='note-connections'),
]