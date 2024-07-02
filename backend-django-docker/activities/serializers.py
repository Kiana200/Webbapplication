from rest_framework import serializers

from .models import Activity
from account.models import CustomUser

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
            model = Activity
            fields = ('uuid', 'title', 'email', 'group_id', 'start', 'end', 'allDay', 'duration', 'freq', 'dtstart', 'until', 'interval')

class ActivityCreateSerializer(serializers.ModelSerializer):   
      class Meta:
            model = Activity
            fields = ('title', 'email', 'start', 'end', 'allDay', 'duration', 'freq', 'dtstart', 'until')

      def create(self, validated_data):
            activity = Activity.objects.create_activity(
                  title=validated_data['title'],
                  user=CustomUser.objects.get(email=validated_data['email']),
                  start=validated_data['start'],
                  end=validated_data['end'],
                  allDay=validated_data['allDay'],
                  duration=validated_data['duration'],
                  freq=validated_data['freq'],
                  dtstart=validated_data['dtstart'],
                  until=validated_data['until'],
            )
            return activity

class ActivityUpdateSerializer(serializers.ModelSerializer):
      uuid = serializers.UUIDField(write_only=True, required=True)
      title = serializers.CharField(write_only=True, required=True)
      start = serializers.CharField(write_only=True, required=True)
      end = serializers.CharField(write_only=True, required=True, allow_blank=True)
      allDay = serializers.BooleanField(write_only=True, required=True)
      duration = serializers.CharField(write_only=True, required=True, allow_blank=True)
      freq = serializers.CharField(write_only=True, required=True)
      dtstart = serializers.CharField(write_only=True, required=True, allow_blank=True)
      until = serializers.CharField(write_only=True, required=True, allow_blank=True)

      class Meta:
            model = Activity
            fields = ('uuid', 'title', 'start', 'end', 'allDay', 'duration', 'freq', 'dtstart', 'until')

class ActivityDeleteSerializer(serializers.ModelSerializer):
      uuid = serializers.UUIDField(write_only=True, required=True)

      class Meta:
            model = Activity
            fields = ('uuid', )


      
            
            


