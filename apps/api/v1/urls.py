from django.conf.urls import include, url
from django.urls import path

app_name = 'v1'

urlpatterns = [
    path('', include('apps.api.v1.users.urls', namespace='users')),
    path('courses/', include('apps.api.v1.courses.urls', namespace='courses')),
]
