from django.conf.urls import url
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, CourseParticipantsList, CreateCourseParticipant, UserRatingList, UserPointsView, \
    CreateCourseCoCreator, UserFollowersList, FollowingUsersList, CreateNewFollower, InfoAboutUserInCourseView, \
    CoCreatorDeleteView, UserInfoView, FollowerUserInfo, FollowerDeleteView

app_name = 'users'

router = DefaultRouter(trailing_slash=False)
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^course/(?P<course_pk>\d+)/participants/$', CourseParticipantsList.as_view(), name="course_participants"),
    url(r'^new_course_participant/', CreateCourseParticipant.as_view(), name="new_course_participant"),
    url(r'^new_course_co_creator/', CreateCourseCoCreator.as_view(), name="new_course_co_creator"),
    url(r'^my_ratings/', UserRatingList.as_view(), name="my_ratings"),
    url(r'^my_points/', UserPointsView.as_view(), name="my_points"),
    url(r'^user/(?P<user_pk>\d+)/followers', UserFollowersList.as_view(), name="user_followers"),
    url(r'^user/(?P<user_pk>\d+)/following_users', FollowingUsersList.as_view(), name="following_users"),
    url(r'^new_follower/', CreateNewFollower.as_view(), name="new_follower"),
    url(r'^user-info-in-course/user/(?P<user_pk>\d+)/course/(?P<course_pk>\d+)/', InfoAboutUserInCourseView.as_view(),
        name="user_info_in_course"),
    url(r'^delete-co-creator/(?P<pk>\d+)/$',
        CoCreatorDeleteView.as_view(), name='delete-co-creator'),
    url(r'^delete-follower/(?P<pk>\d+)/$',
        FollowerDeleteView.as_view(), name='delete-follower'),
    url(r'^user-info/$',
        UserInfoView.as_view(), name='user-info'),
    url(r'^user-follower-info/follower/(?P<follower_pk>\d+)/followed_user/(?P<followed_user_pk>\d+)/$',
        FollowerUserInfo.as_view(), name='user-follower-info'),
]
