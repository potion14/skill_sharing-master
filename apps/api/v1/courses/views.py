from django.db import transaction
from django.db.models import Q
from rest_framework import viewsets, generics
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.api.v1.courses.serializers import CourseSerializer, ChapterSerializer, CourseChapterCommentSerializer, \
    UserCourseRatingSerializer, CourseSubCategorySerializer, CategorySerializer
from apps.courses.models import Course, CourseChapter, CourseChapterComment, UserCourseRating, CourseSubcategory, CourseMainCategory


class CoursesViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user_id = self.kwargs.get('user_pk')
        if user_id:
            queryset = Course.objects.filter(Q(creator_id=user_id) | Q(co_creators__co_creator_id=user_id))
        else:
            queryset = Course.objects.all()
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        try:
            with transaction.atomic():
                serializer.save(creator=user)
        except Exception as e:
            raise APIException(str(e))

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context


class MyCoursesList(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user_id = self.request.user.id
        queryset = Course.objects.filter(Q(creator_id=user_id) | Q(co_creators__co_creator_id=user_id))
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context


class StartedCoursesList(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user_id = self.request.user.id
        queryset = Course.objects.filter(Q(participants__participant_id=user_id))
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context


class TopCoursesRanking(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        from django.db.models import Avg
        queryset = Course.objects.annotate(course_rate=Avg('user_ratings__rating')).order_by('-course_rate')
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context


class CourseChaptersViewSet(viewsets.ModelViewSet):
    queryset = CourseChapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        course_id = self.kwargs.get('course_pk')
        queryset = CourseChapter.objects.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):
        course_pk = self.kwargs.get('course_pk')
        try:
            with transaction.atomic():
                serializer.save(course_id=course_pk)
        except Exception as e:
            raise APIException(str(e))

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context


class CourseChapterCommentsViewSet(viewsets.ModelViewSet):
    queryset = CourseChapterComment.objects.all()
    serializer_class = CourseChapterCommentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        chapter_id = self.kwargs.get('chapter_pk')
        queryset = CourseChapterComment.objects.filter(chapter_id=chapter_id, reply_to=None)
        return queryset

    def perform_create(self, serializer):
        from apps.courses.models import CourseRatingSystem
        from apps.users.models import CourseCoCreator
        user = self.request.user
        chapter_pk = self.kwargs.get('chapter_pk')
        try:
            with transaction.atomic():
                chapter = CourseChapter.objects.filter(id=chapter_pk).first()
                course = Course.objects.filter(chapters=chapter).first()
                course_creator = course.creator
                points_for_activity_co = CourseRatingSystem.objects.filter(
                    action=int(CourseRatingSystem.ACTIONS.new_comment_co)).first()
                if points_for_activity_co is None:
                    points_for_activity_co = 3
                else:
                    points_for_activity_co = points_for_activity_co.rating
                course_creator.points += points_for_activity_co
                course_creator.save()
                course_co_creators = [co_creator.user for co_creator in
                                      CourseCoCreator.objects.filter(course=course)]
                for user_co_creator in course_co_creators:
                    points_for_activity_cc = CourseRatingSystem.objects.filter(
                        action=int(CourseRatingSystem.ACTIONS.new_comment_cc)).first()
                    if points_for_activity_cc is None:
                        points_for_activity_cc = 2
                    else:
                        points_for_activity_cc = points_for_activity_cc.rating
                    user_co_creator.points += points_for_activity_cc
                    user_co_creator.save()
                serializer.save(chapter_id=chapter_pk, author=user)
        except Exception as e:
            raise APIException(str(e))


class CourseRatingsViewSet(viewsets.ModelViewSet):
    queryset = UserCourseRating.objects.all()
    serializer_class = UserCourseRatingSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        course_id = self.kwargs.get('course_pk')
        queryset = UserCourseRating.objects.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):
        from apps.courses.models import CourseRatingSystem
        from apps.users.models import CourseCoCreator
        user = self.request.user
        course_id = self.kwargs.get('course_pk')
        try:
            with transaction.atomic():
                course = Course.objects.filter(id=course_id).first()
                course_creator = course.creator
                points_for_activity_co = CourseRatingSystem.objects.filter(
                    action=int(CourseRatingSystem.ACTIONS.new_rating_co)).first()
                if points_for_activity_co is None:
                    points_for_activity_co = 3
                else:
                    points_for_activity_co = points_for_activity_co.rating
                course_creator.points += points_for_activity_co
                course_creator.save()
                course_co_creators = [co_creator.user for co_creator in
                                      CourseCoCreator.objects.filter(course=course)]
                for user_co_creator in course_co_creators:
                    points_for_activity_cc = CourseRatingSystem.objects.filter(
                        action=int(CourseRatingSystem.ACTIONS.new_rating_cc)).first()
                    if points_for_activity_cc is None:
                        points_for_activity_cc = 2
                    else:
                        points_for_activity_cc = points_for_activity_cc.rating
                    user_co_creator.points += points_for_activity_cc
                    user_co_creator.save()
                serializer.save(course_id=course_id, author=user)
        except Exception as e:
            raise APIException(str(e))


class CourseSubCategoryList(generics.ListCreateAPIView):
    queryset = CourseSubcategory.objects.all()
    serializer_class = CourseSubCategorySerializer
    permission_classes = (AllowAny,)


class CourseCategoryList(generics.ListCreateAPIView):
    queryset = CourseMainCategory.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)


class CourseVisibilityList(APIView):
    def get(self, request, *args, **kwargs):
        response = ({'id': key,
                    'name': value} for key, value in Course.VISIBILITY())

        return Response(response)




