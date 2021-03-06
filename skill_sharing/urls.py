from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # API
    path('api/', include('apps.api.urls', namespace='api')),
]
