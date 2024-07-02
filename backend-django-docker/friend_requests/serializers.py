from account.models import CustomUser
from rest_framework import serializers
from .models import FriendRequests

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
            model = FriendRequests
            fields = ('id',)

class FriendRequestCreateSerializer(serializers.ModelSerializer):   
      class Meta:
            model = FriendRequests
            fields = ('from_user', 'to_user')

      def create(self, validated_data):
            friend_request = FriendRequests.objects.create_friend_request(
                    from_user=CustomUser.objects.get(email=validated_data['from_user']),
                    to_user=CustomUser.objects.get(email=validated_data['to_user']),
            )
            return friend_request

class SentFriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
            model = FriendRequests
            fields = ('to_user',)

class ReceivedFriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
            model = FriendRequests
            fields = ('from_user',)

class DeclineFriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
            model = FriendRequests
            fields = ('from_user', 'to_user')