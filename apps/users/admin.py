from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, UserFollower, CourseParticipant, CourseCoCreator


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('id', 'email', 'is_staff', 'is_active', 'points')
    list_filter = ('email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password', 'username', 'points')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_staff', 'is_active', 'points')}
        ),
    )
    search_fields = ('email', 'username')
    ordering = ('email',)


admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(UserFollower)
class UserFollowerAdmin(admin.ModelAdmin):
    list_display = ('user', 'follower')
    ordering = ('user', 'follower')
    search_fields = ('user', 'follower')


@admin.register(CourseParticipant)
class CourseParticipantAdmin(admin.ModelAdmin):
    list_display = ('participant', 'course')
    ordering = ('course', 'participant')
    search_fields = ('participant', 'course')


@admin.register(CourseCoCreator)
class CourseCoCreatorAdmin(admin.ModelAdmin):
    list_display = ('co_creator', 'course')
    ordering = ('course', 'co_creator')
    search_fields = ('co_creator', 'course')

