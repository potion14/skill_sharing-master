from rest_framework import serializers

from apps.users.models import CustomUser as User, UserRating
from apps.users.models import CourseParticipant, CourseCoCreator


class UserSerializer(serializers.HyperlinkedModelSerializer):
    date_joined = serializers.DateTimeField(format='%m-%d-%Y', read_only=True)

    class Meta:
        read_only_fields = [
            "date_joined",
        ]
        model = User
        fields = ['id', 'email', 'date_joined',  'points']


class CourseParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseParticipant
        fields = ['id', 'participant', 'course',  'is_active']


class CourseCoCreatorSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseCoCreator
        fields = ['id', 'course',  'co_creator', 'is_active']


class UserRatingSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%m-%d-%Y %H:%M', read_only=True)
    user = serializers.SerializerMethodField()

    class Meta:
        read_only_fields = [
            "created_at",
        ]
        model = UserRating
        fields = ['id', 'rating', 'user', 'action', 'created_at']

    def get_user(self, obj):
        serializer = UserSerializer(obj.creator)
        return serializer.data


