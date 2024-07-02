from django.urls import path
from .views import CreateActivityView, LoadAllActivitesView, UpdateActivityView, DeleteActivityView


urlpatterns = [
    path('create', CreateActivityView.as_view()),
    path('load', LoadAllActivitesView.as_view()),
    path('update', UpdateActivityView.as_view()),
    path('delete', DeleteActivityView.as_view()),
]
