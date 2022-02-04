from django.conf.urls import url
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CoursesViewSet, CourseChaptersViewSet, CourseChapterCommentsViewSet, MyCoursesList, \
    CourseRatingsViewSet, StartedCoursesList, TopCoursesRanking, CourseSubCategoryList, CourseCategoryList, CourseVisibilityList

app_name = 'courses'

router = DefaultRouter(trailing_slash=False)
router.register(r'all_courses', CoursesViewSet, basename='course')
router.register(r'user_courses/(?P<user_pk>\d+)', CoursesViewSet, basename='user_courses')
router.register(r'course/(?P<course_pk>\d+)/chapters', CourseChaptersViewSet, basename='course_chapters')
router.register(r'course/chapter/(?P<chapter_pk>\d+)/comments', CourseChapterCommentsViewSet,
                basename='course_chapter_comments')
router.register(r'course/(?P<course_pk>\d+)/ratings/', CourseRatingsViewSet,
                basename='course_ratings')

urlpatterns = [
    path('', include(router.urls)),
    url(r'^my_courses', MyCoursesList.as_view(), name="my_courses"),
    url(r'^my-started-courses', StartedCoursesList.as_view(), name='started_courses'),
    url(r'^top-courses-ranking', TopCoursesRanking.as_view(), name='top_courses'),
    url(r'^subcategories', CourseSubCategoryList.as_view(), name='subcategories'),
    url(r'^main_categories', CourseCategoryList.as_view(), name='main_categories'),
    url(r'^course-visibility', CourseVisibilityList.as_view(), name='course-visibility'),
]
