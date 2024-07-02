from account.models import CustomUser
from django.db import models

from .managers import FriendRequestsManager

class FriendRequests(models.Model):
    from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='from_user')
    to_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='to_user')

    class Meta: # Makes friend requests unique.
        constraints = [
            models.UniqueConstraint(
                fields=['from_user', 'to_user'], name='unique_friend_request_combination'
            )
        ]

    objects = FriendRequestsManager()

    REQUIRED_FIELDS = ['from_user', 'to_user']

    def __str__(self) -> str:
        return self.from_user.email + ' sent a friend request to ' + self.to_user.email