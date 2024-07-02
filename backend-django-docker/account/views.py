from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from django.contrib.auth.hashers import check_password

from .serializers import ChangePasswordSerializer, FriendDeleteSerializer, UserCreateSerializer, UserSerializer
from .models import CustomUser


class RegisterView(APIView):
    '''
    View that handles registration of a new user.
    '''

    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        data = request.data
        serializer = UserCreateSerializer(data=data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.create(serializer.validated_data)
        user = UserSerializer(user)
        
        return Response(
                {'success': 'User with email ' + user.data['email'] + ' was registered'}, 
                status=status.HTTP_201_CREATED
            )


class LoadUserView(APIView):
    '''
    View that handles the retrieving of an user, 
    user information is retrieved from the attached JWT token in the request.
    '''

    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        try:
            user = request.user # Get user information from the JWT token.
            user = UserSerializer(user)

            return Response({'user': user.data}, status=status.HTTP_200_OK)
        except:
            return Response(
                {'error': 'Something went wrong when trying to load user'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    
class LoadAllUsersView(APIView):
    '''
    View that retrieves all the CustomUser objects in the database and returns them in an list.
    '''

    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        try:
            users = CustomUser.objects.all()
            user_list = []
            for user in users:
                serialized_activity = UserSerializer(user)
                user_list.append(serialized_activity.data)
            return Response(
                    { 'users': user_list },
                    status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when trying to load all users'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class ChangePasswordView(generics.UpdateAPIView):
    '''
    View that handles the updating of an user's password.
    '''

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer
    def get_user(self)-> CustomUser:
        '''
        Function that retrieves a CustomUser object from the database and returns it,
        user information is retrived from the JWT token.
        '''
        try:
            email = self.request.user # Gets user email from token.
            user = CustomUser.objects.filter(email=email) # Retrives user object.
            return user
        except:
            return Response(
                {'error': 'Something went wrong when trying to change password'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request):
        self.object = self.get_user()
        if isinstance(self.object, Response): # An error was returned instead of a CustomUser object (An user).
            return self.object
        
        if not self.object:
            return Response(
                {'error': 'Could not find user'}, status=status.HTTP_404_NOT_FOUND
            )
        
        user: CustomUser = self.object[0]
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            current_password = self.object.values_list('password')[0][0]

            if not check_password(old_password, current_password):
                return Response(
                    {'error': 'Wrong current password was inputted'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response(
                {'success': 'Password was successfully updated'},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteFriendView(generics.DestroyAPIView):
    '''
    View that handles when an user wants to remove an friend.
    '''

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FriendDeleteSerializer

    def delete(self, request):
        try:
            data = self.request.data
            friend_to_be_removed_email = data['email']

            email = self.request.user # Gets user email from token.
            user = CustomUser.objects.get(email=email) # Get the user object that made the request.
            friend_user = CustomUser.objects.get(email=friend_to_be_removed_email) # Get the user object that will removed from the friends list.

            user.friends.set(user.friends.exclude(email=friend_to_be_removed_email))
            friend_user.friends.set(friend_user.friends.exclude(email=email))
            
            return Response(
                {'success': friend_to_be_removed_email + ' was successfully removed as friend'},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when trying to remove ' + friend_to_be_removed_email + ' as friend'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )