from account.models import CustomUser
from django.db import models
from uuid import uuid4

from .managers import CustomActivitiesManager

class Activity(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, unique=True, editable=False)
    email = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='activities')
    group_id = models.CharField(max_length=100, blank=True, unique=True, default=uuid4)
    title = models.CharField(max_length=255)
    start = models.CharField(max_length=255)
    end = models.CharField(max_length=255)
    allDay = models.BooleanField(default=False)
    duration = models.CharField(max_length=255) # The duration of the event is, in hours.
    freq = models.CharField(max_length=255)
    dtstart = models.CharField(max_length=255) # Start of the repeated event. Null if not repeated.
    until = models.CharField(max_length=255) # The date, day, the repeated event ends. Null if not repeated.
    interval = models.IntegerField(default=1)

    objects = CustomActivitiesManager()

    REQUIRED_FIELDS = ['title', 'email', 'group_id', 'start', 'end', 'allDay', 'duration']

    def __str__(self) -> str:
        return self.title