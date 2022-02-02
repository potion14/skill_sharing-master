from django.db import transaction
from rest_framework import viewsets, generics
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.models import Course
from apps.users.models import CustomUser as User, CourseParticipant, CourseCoCreator, UserRating
from .serializers import UserSerializer, CourseParticipantSerializer, UserRatingSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)


class CourseParticipantsList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        course_id = self.kwargs.get('course_pk')
        queryset = User.objects.filter(courses__course_id=course_id)
        return queryset


class CreateCourseParticipant(generics.CreateAPIView):
    serializer_class = CourseParticipantSerializer
    queryset = CourseParticipant.objects.all()

    def perform_create(self, serializer):
        from apps.courses.models import CourseRatingSystem
        try:
            with transaction.atomic():
                serializer.save()
                course_pk = serializer.data['course']
                course = Course.objects.filter(id=course_pk).first()
                course_creator = course.creator
                points_for_activity_co = CourseRatingSystem.objects.filter(
                    action=int(CourseRatingSystem.ACTIONS.new_participant_co)).first()
                if points_for_activity_co is None:
                    points_for_activity_co = 5
                else:
                    points_for_activity_co = points_for_activity_co.rating
                course_creator.points += points_for_activity_co
                course_creator.save()
                course_co_creators = [co_creator.user for co_creator in
                                      CourseCoCreator.objects.filter(course_id=course_pk)]
                for user_co_creator in course_co_creators:
                    points_for_activity_cc = CourseRatingSystem.objects.filter(
                        action=int(CourseRatingSystem.ACTIONS.new_participant_cc)).first()
                    if points_for_activity_cc is None:
                        points_for_activity_cc = 3
                    else:
                        points_for_activity_cc = points_for_activity_cc.rating
                    user_co_creator.points += points_for_activity_cc
                    user_co_creator.save()
        except Exception as e:
            raise APIException(str(e))


class UserRatingList(generics.ListCreateAPIView):
    queryset = UserRating.objects.all()
    serializer_class = UserRatingSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = UserRating.objects.filter(user=user)
        return queryset


class UserPointsView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({'user_points': user.points})
