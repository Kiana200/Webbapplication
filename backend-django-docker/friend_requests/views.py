from account.models import CustomUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics

from .serializers import FriendRequestSerializer, FriendRequestCreateSerializer, SentFriendRequestSerializer, ReceivedFriendRequestSerializer, DeclineFriendRequestSerializer
from .models import FriendRequests
from account.models import CustomUser

class SendFriendRequestView(APIView):
    '''
    View that handles when an user sends a friend request to another user.
    '''

    permission_classes = (permissions.IsAuthenticated, )
    def post(self, request):
        try:
            data = request.data

            from_user_email = data['from_user'] # User email who sent the friend request.
            to_user_email = data['to_user'] # User email who will receive the friend request.

            friends = CustomUser.objects.get(email=from_user_email).friends

            if friends.all() != None:
                for friend in friends.all():
                    if friend.email == to_user_email:
                        return Response(
                            { 'error': 'You are already friends with ' +  data['to_user']},
                            status=status.HTTP_409_CONFLICT
                        )

            friend_request = FriendRequests.objects.filter(to_user=to_user_email, from_user=from_user_email)
            if(not friend_request):
                serializer = FriendRequestCreateSerializer(data=data)             
                new_friend_request = serializer.create(data)
                new_friend_request = FriendRequestSerializer(new_friend_request) 

                return Response(
                        { 'success': 'Friend request has been sent to ' +  data['to_user']},
                        status=status.HTTP_201_CREATED
                )
            return Response(
                { 'error': 'You have already sent this user a friend request' },
                status=status.HTTP_409_CONFLICT
            )
        except:
            return Response(
                { 'error': 'Something went wrong when trying to send a friend request' },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AcceptFriendRequestView(APIView):
    '''
    View that handles when an user accepts a friend request from another user.
    '''

    permission_classes = (permissions.IsAuthenticated, )
    def get_user(self)-> CustomUser:
        '''
        Function that retrieves an CustomUser object from a JWT token that is attached to the request.
        '''
        try:
            return self.request.user # Gets userfrom token.
        except:
            return Response(
                {'error': 'Something went wrong when trying to accept a friend request'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        user = self.get_user()
        if isinstance(user, Response): # An error was returned instead of an email.
            return user
        
        try:
            if not user or ((self.request.data['to_user'] != user.email and self.request.data['from_user'] != user.email)):
                return Response(
                    {'error': 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED
                )
        
            to_user = request.data['to_user']
            from_user = request.data['from_user']

            friend_request = FriendRequests.objects.filter(to_user=to_user, from_user=from_user)[0]
            if friend_request.to_user == user: #  Check to see if the correct user is accepting the friend request.
                from_user_email = friend_request.from_user.email

                friend_request.to_user.friends.add(friend_request.from_user)
                friend_request.from_user.friends.add(friend_request.to_user)
                friend_request.delete()
                return Response(
                        {'success': 'Friendrequst sent from ' + from_user_email + ' was accepted' },
                        status=status.HTTP_200_OK
                )
            return Response(
                {'error': 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED
            )
        except:
            return Response(
                { 'error': 'Something went wrong when trying to accept a friend request' },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class GetSentFriendRequestView(APIView):
    '''
    View that retrieves all friend requests an user has sent to other users.
    '''

    permission_classes = (permissions.IsAuthenticated, )
    def get_email(self)-> str:
        '''
        Function that retrieves an email from a JWT token that is attached to the request.
        '''
        try:
            return self.request.user.email # Gets user email from token.
        except:
            return Response(
                {'error': 'Something went wrong when trying to get all sent friend request'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        try:
            email = self.get_email()
            if isinstance(email, Response): # An error was returned instead of an email.
                return email
        
            if not email:
                return Response(
                    {'error': 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED
                )
        
            sent_friend_requests = FriendRequests.objects.filter(from_user=email)

            sent_friend_request_list = []
            if sent_friend_requests.all() != None:
                for friend_request in sent_friend_requests.all():
                    serializer = SentFriendRequestSerializer(friend_request)
                    sent_friend_request_list.append(serializer.data['to_user'])

            return Response(
                { 'success': sent_friend_request_list},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                { 'error': 'Something went wrong when trying to get all sent friend requests' },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GetReceivedFriendRequestView(APIView):
    '''
    View that retrieves all friend requests an user has received.
    '''

    permission_classes = (permissions.IsAuthenticated, )
    def get_email(self)-> str:
        '''
        Function that retrieves an email from a JWT token that is attached to the request.
        '''
        try:
            return self.request.user.email # Gets user email from token.
        except:
            return Response(
                {'error': 'Something went wrong when trying to get all received friend request'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        try:
            email = self.get_email()
            if isinstance(email, Response): # An error was returned instead of an email.
                return email
            
            if not email:
                return Response(
                    {'error': 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED
                )
        
            received_friend_requests = FriendRequests.objects.filter(to_user=email)

            received_friend_request_list = []
            if received_friend_requests.all() != None:
                for friend_request in received_friend_requests.all():
                    serializer = ReceivedFriendRequestSerializer(friend_request)
                    received_friend_request_list.append(serializer.data['from_user'])

            return Response(
                { 'success': received_friend_request_list},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                { 'error': 'Something went wrong when trying to get all received friend requests' },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RemoveFriendRequestView(generics.DestroyAPIView):
    '''
    View that removes a friend request from the database.
    '''

    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = DeclineFriendRequestSerializer
    def get_email(self)-> str:
        '''
        Function that retrieves an email from a JWT token that is attached to the request.
        '''
        try:
            return self.request.user.email # Gets user email from token.
        except:
            return Response(
                {'error': 'Something went wrong when trying to decline a friend request'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_friend_request(self) -> FriendRequests:
        '''
        Function that retrieves a friend request object from the database.
        '''
        try:
            data = self.request.data
            return FriendRequests.objects.get(from_user=data['from_user'], to_user=data['to_user'])
        except:
            return Response(
                {'error': 'No friend request was found that matches'},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request):    
        try:
            email = self.get_email()
            if isinstance(email, Response): # An error was returned instead of an email.
                return email
            
            if not email or ((self.request.data['to_user'] != email and self.request.data['from_user'] != email)):
                return Response(
                    {'error': 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED
                )
                
            serializer = DeclineFriendRequestSerializer(data=request.data)

            if serializer.is_valid():
                friend_request = self.get_friend_request()
                if isinstance(friend_request, Response): # An error was returned instead of an activity.
                    return friend_request

                from_user_email: str = friend_request.from_user.email
                friend_request.delete()
                if self.request.data['to_user'] == email:
                    return Response(
                        { 'success': 'Friend request sent by ' + from_user_email + ' has been declined'},
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        { 'success': 'Sent friend request has been removed'},
                        status=status.HTTP_200_OK
                    )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        except:
            return Response(
                { 'error': 'Something went wrong when trying to decline a friend request' },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )