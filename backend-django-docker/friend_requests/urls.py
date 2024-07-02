from django.urls import path
from .views import SendFriendRequestView, AcceptFriendRequestView, GetSentFriendRequestView, GetReceivedFriendRequestView, RemoveFriendRequestView

urlpatterns = [
    path('send', SendFriendRequestView.as_view()),
    path('accept', AcceptFriendRequestView.as_view()),
    path('getsent', GetSentFriendRequestView.as_view()),
    path('getreceived', GetReceivedFriendRequestView.as_view()),
    path('remove', RemoveFriendRequestView.as_view()),
]