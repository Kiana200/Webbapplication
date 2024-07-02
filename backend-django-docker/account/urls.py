from django.urls import path
from .views import RegisterView, LoadUserView, ChangePasswordView, LoadAllUsersView, DeleteFriendView


urlpatterns = [
    path('register', RegisterView.as_view()),
    path('user', LoadUserView.as_view()),
    path('changepassword', ChangePasswordView.as_view()),
    path('users', LoadAllUsersView.as_view()),
    path('delete_friend', DeleteFriendView.as_view()),
]
