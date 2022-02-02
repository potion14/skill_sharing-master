from django.conf.urls import include, url
from django.urls import path

app_name = 'api'

urlpatterns = [
    path('v1/', include('apps.api.v1.urls', namespace='v1'))
]
