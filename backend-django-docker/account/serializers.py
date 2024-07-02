from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.contrib.auth import get_user_model
User = get_user_model()

from activities.serializers import ActivitySerializer

class UserSerializer(serializers.ModelSerializer):
      activities = ActivitySerializer(read_only=True, many=True)
      
      class Meta:
            model = User
            fields = ('first_name', 'last_name', 'email', 'activities', 'friends')

class UserCreateSerializer(serializers.ModelSerializer):
      class Meta:
            model = User
            fields = ('first_name', 'last_name', 'email', 'password')

      def validate(self, data):
            user = User(**data)
            password = data.get('password')

            try:
                  validate_password(password, user)
            except exceptions.ValidationError as error:
                  errors = serializers.as_serializer_error(error)
                  raise exceptions.ValidationError(
                        { 'password': errors['non_field_errors'] }
                  )
            return data

      def create(self, validated_data):
            user = User.objects.create_user(
                  first_name=validated_data['first_name'],
                  last_name=validated_data['last_name'],
                  email=validated_data['email'],
                  password=validated_data['password'],
            )
            return user

class ChangePasswordSerializer(serializers.ModelSerializer):
      old_password = serializers.CharField(write_only=True, required=True)
      password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
      repeated_password = serializers.CharField(write_only=True, required=True)
    
      class Meta:
            model = User
            fields = ('old_password', 'password', 'repeated_password')

      def validate(self, attrs):
        if attrs['password'] != attrs['repeated_password']:
            raise serializers.ValidationError({'error': 'Password fields did not match.'})
        return attrs

class UserFriendsSerializer(serializers.ModelSerializer):
      class Meta:
            model = User
            fields = ('email',)

class FriendDeleteSerializer(serializers.ModelSerializer):
      class Meta:
            model = User
            fields = ('email',)