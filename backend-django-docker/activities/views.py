from activities.models import Activity
from account.serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics

from .serializers import ActivityDeleteSerializer, ActivitySerializer, ActivityCreateSerializer, ActivityUpdateSerializer
from account.models import CustomUser

class CreateActivityView(APIView):
    '''
    View that handles when an user adds a new activity to the calendar.
    '''

    permission_classes = (permissions.IsAuthenticated, )
    def post(self, request):
        try:
            data = request.data
            
            serializer = ActivityCreateSerializer(data=data)
            activity = serializer.create(data)
            activity = ActivitySerializer(activity)

            return Response(
                    activity.data,
                    status=status.HTTP_201_CREATED
            )
        except:
            return Response(
                { 'error': 'Something went wrong when trying to create a new activity' },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoadAllActivitesView(APIView):
    '''
    View that handles when an user wants to retrive all their activities from the database.
    '''

    permission_classes = (permissions.IsAuthenticated, )
    def get(self, request):
        try:
            user = request.user
            user = UserSerializer(user)
            
            email = user.data['email']
            try:
                activities = CustomUser.objects.get(email=email).activities
            except:
                return Response(
                    { 'error': 'An user with that email does not exist' },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            activity_list = []
            if activities.all() != None:
                for activity in activities.all():
                    serialized_activity = ActivitySerializer(activity)
                    activity_list.append(serialized_activity.data)
            return Response(
                    { 'activities': activity_list },
                    status=status.HTTP_200_OK
            )
        except:
            return Response(
                { 'error': 'Something went wrong when trying to get all activites for an user' },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UpdateActivityView(generics.UpdateAPIView):
    '''
    View that handles when an user wants to update an activity in the calendar.
    '''

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ActivityUpdateSerializer
    def get_activity(self)-> Activity:
        '''
        Function that returns an activity from the database based on an uuid value that is attached to the PUT request.
        '''
        try:
            data = self.request.data
            return Activity.objects.get(uuid=data['uuid'])
        except:
            return Response(
                {'error': 'No activity was found that matches that uuid'}, status=status.HTTP_404_NOT_FOUND
            )

    def update(self, request):
        try:
            serializer = ActivityUpdateSerializer(data=request.data)

            if serializer.is_valid():
                activity = self.get_activity()
                if isinstance(activity, Response): # An error was returned instead of an activity.
                    return activity

                if(activity.uuid == serializer.validated_data['uuid']):
                    activity.title = serializer.validated_data['title']
                    activity.start = serializer.validated_data['start']
                    activity.end = serializer.validated_data['end']
                    activity.allDay = serializer.validated_data['allDay']
                    activity.duration = serializer.validated_data['duration']
                    activity.freq = serializer.validated_data['freq']
                    activity.dtstart = serializer.validated_data['dtstart']
                    activity.until = serializer.validated_data['until']
                    activity.save()
                    
                    serialized_activity = ActivitySerializer(activity)
                    return Response(serialized_activity.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        except:
            return Response(
                { 'error': 'Something went wrong when trying to update an activity' },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DeleteActivityView(generics.DestroyAPIView):
    '''
    View that handles when an user wants to delete an activity from the calendar.
    '''

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ActivityDeleteSerializer
    def get_activity(self):
        '''
        Function that returns an activity from the database based on an uuid value that is attached to the PUT request.
        '''
        try:
            data = self.request.data
            return Activity.objects.get(uuid=data['uuid'])
        except:
            return Response(
                {'error': 'No activity was found that matches that uuid'}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request):
        try:
            serializer = ActivityDeleteSerializer(data=request.data)

            if serializer.is_valid():
                activity = self.get_activity()
                if isinstance(activity, Response): # An error was returned instead of an activity.
                    return activity

                id = activity.uuid
                activity.delete()
                return Response(id, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        except:
            return Response(
                { 'error': 'Something went wrong when trying to delete an activity' },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )