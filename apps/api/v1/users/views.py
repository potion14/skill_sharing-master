from django.contrib.auth.models import AnonymousUser
from django.db import transaction
from django.http import HttpResponseForbidden
from rest_framework import viewsets, generics
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.courses.models import Course
from apps.users.models import CustomUser as User, CourseParticipant, CourseCoCreator, UserRating, UserFollower
from .serializers import UserSerializer, CourseParticipantSerializer, UserRatingSerializer, CourseCoCreatorSerializer, \
    UserFollowerSerializer


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
    permission_classes = (IsAuthenticated,)

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
                    points_for_activity_co = 5 + (course.rating*2)
                else:
                    points_for_activity_co = points_for_activity_co.rating + (course.rating*2)
                course_creator.points += points_for_activity_co
                course_creator.save()
                UserRating.objects.create(rating=points_for_activity_co,
                                          action=CourseRatingSystem.ACTIONS.new_participant_co,
                                          user=course_creator)
                course_co_creators = [co_creator.co_creator for co_creator in
                                      CourseCoCreator.objects.filter(course_id=course_pk)]
                for user_co_creator in course_co_creators:
                    points_for_activity_cc = CourseRatingSystem.objects.filter(
                        action=int(CourseRatingSystem.ACTIONS.new_participant_cc)).first()
                    if points_for_activity_cc is None:
                        points_for_activity_cc = 3 + (course.rating*2)
                    else:
                        points_for_activity_cc = points_for_activity_cc.rating + (course.rating*2)
                    user_co_creator.points += points_for_activity_cc
                    user_co_creator.save()
                    UserRating.objects.create(rating=points_for_activity_cc,
                                              action=CourseRatingSystem.ACTIONS.new_participant_cc,
                                              user=user_co_creator)
                user_pk = serializer.data['participant']
                user = User.objects.filter(id=user_pk).first()
                user.points -= course.price
                user.save()
        except Exception as e:
            raise APIException(str(e))


class CreateCourseCoCreator(generics.CreateAPIView):
    serializer_class = CourseCoCreatorSerializer
    queryset = CourseCoCreator.objects.all()
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                serializer.save()
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
        try:
            return Response({'user_points': user.points})
        except AttributeError:
            return HttpResponseForbidden()


class InfoAboutUserInCourseView(APIView):
    def get(self, request, *args, **kwargs):
        if request.user.id is None:
            return HttpResponseForbidden()
        user_pk = self.kwargs.get('user_pk')
        course_pk = self.kwargs.get('course_pk')
        user_participant = CourseParticipant.objects.filter(participant_id=user_pk, course_id=course_pk).first()
        user_participant_id = user_participant.id if user_participant else ''

        user_co_creator = CourseCoCreator.objects.filter(course_id=course_pk, co_creator_id=user_pk).first()
        user_co_creator_id = user_co_creator.id if user_co_creator else ''
        return Response({'user_participant_id': user_participant_id,
                         'user_co_creator_id': user_co_creator_id})


class FollowerUserInfo(APIView):
    def get(self, request, *args, **kwargs):
        if request.user.id is None:
            return HttpResponseForbidden()
        follower_user_pk = self.kwargs.get('follower_pk')
        following_user_pk = self.kwargs.get('followed_user_pk')
        follower = UserFollower.objects.filter(user_id=following_user_pk, follower_id=follower_user_pk).first()
        follower_id = follower.id if follower else ''

        return Response({'follower_id': follower_id, })


class UserFollowersList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user_id = self.kwargs.get('user_pk')
        queryset = User.objects.filter(followed_users__user_id=user_id)
        return queryset


class UserInfoView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            serialized_user = UserSerializer(instance=user).data
            return Response(serialized_user)
        except AttributeError:
            return HttpResponseForbidden()



class FollowingUsersList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user_id = self.kwargs.get('user_pk')
        queryset = User.objects.filter(followers__follower_id=user_id)
        return queryset


class CreateNewFollower(generics.CreateAPIView):
    serializer_class = UserFollowerSerializer
    queryset = UserFollower.objects.all()
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        from apps.courses.models import CourseRatingSystem
        try:
            with transaction.atomic():
                serializer.save()
                user_pk = serializer.data['user']
                user = User.objects.filter(id=user_pk).first()
                points_for_activity = CourseRatingSystem.objects.filter(
                    action=int(CourseRatingSystem.ACTIONS.new_follower)).first()
                if points_for_activity is None:
                    points_for_activity = 1
                else:
                    points_for_activity = points_for_activity.rating
                user.points += points_for_activity
                user.save()
                UserRating.objects.create(rating=points_for_activity,
                                          action=CourseRatingSystem.ACTIONS.new_follower,
                                          user=user)
        except Exception as e:
            raise APIException(str(e))


class CoCreatorDeleteView(generics.DestroyAPIView):
    queryset = CourseCoCreator.objects.all()
    permission_classes = (IsAuthenticated,)


class FollowerDeleteView(generics.DestroyAPIView):
    queryset = UserFollower.objects.all()
    permission_classes = (IsAuthenticated,)
