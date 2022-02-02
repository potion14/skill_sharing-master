from django.conf.urls import url
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CourseParticipantsList, CreateCourseParticipant, UserRatingList, UserPointsView

app_name = 'users'

router = DefaultRouter(trailing_slash=False)
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^course/(?P<course_pk>\d+)/participants/$', CourseParticipantsList.as_view(), name="course_participants"),
    url(r'^new_course_participant/', CreateCourseParticipant.as_view(), name="new_course_participant"),
    url(r'^my_ratings/', UserRatingList.as_view(), name="my_ratings"),
    url(r'^my_points/', UserPointsView.as_view(), name="my_points")
]
