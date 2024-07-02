from django.db import models
from django.utils.translation import gettext_lazy as _


class FriendRequestsManager(models.Manager):
    '''
    Friend requests model manager where from_user and to_user is 
    the unique identifiers.
    '''
    def create_friend_request(self, from_user: str, to_user: str):
        '''
        Create and save a friend request with the email from the user that send the
        friend request (from_user) and the email from the user that receives the friend request
        (to_user).
        '''
        friend_request = self.model(
            from_user=from_user,
            to_user=to_user,
        )
        
        friend_request.save()
        return friend_request