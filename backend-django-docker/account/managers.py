from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    '''
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    '''
    def create_user(self, first_name, email, last_name, password=None):
        '''
        Create and save an user with the given email and password.
        '''
        if not email:
            raise ValueError(_('The Email must be set'))
        
        email = self.normalize_email(email)

        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=email,
        )
        
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, first_name, email, last_name, password=None):
        '''
        Create and save a SuperUser with the given email and password.
        '''
        user = self.create_user(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password
        )

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user