from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

from account.models import CustomUser


class CustomActivitiesManager(BaseUserManager):
    '''
    Custom activities model manager where id is the unique identifier.
    '''
    def create_activity(self, title: str, user: CustomUser, start: str, end: str, allDay: bool, duration: str, freq: str, dtstart: str, until: str):
        '''
        Create and save an activity
        ''' 
        activity = self.model(
                title=title,
                email=user,
                start=start,
                allDay=allDay,
                end=end,
                duration=duration,
                freq=freq,
                dtstart=dtstart,
                until=until
            )
        activity.save()
        return activity