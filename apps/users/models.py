from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(_('Username'), unique=True, max_length=256)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    points = models.IntegerField(default=0)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.username


class CourseCoCreator(models.Model):
    from apps.courses.models import Course
    course = models.ForeignKey(Course, verbose_name=_('Course'), related_name='co_creators', on_delete=models.CASCADE)
    co_creator = models.ForeignKey(CustomUser, verbose_name=_('Co-Creator'), related_name='courses_managed',
                                   on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)


class CourseParticipant(models.Model):
    from apps.courses.models import Course
    course = models.ForeignKey(Course, verbose_name=_('Course'), related_name='participants', on_delete=models.CASCADE)
    participant = models.ForeignKey(CustomUser, verbose_name=_('Participant'),
                                    related_name='courses', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('course', 'participant',)


class UserRating(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    rating = models.IntegerField(_('Rating'), default=1, validators=[
        MaxValueValidator(100),
        MinValueValidator(1)
    ])
    from ..courses.models import CourseRatingSystem
    action = models.IntegerField(_('Action'), choices=CourseRatingSystem.ACTIONS)
    user = models.ForeignKey(CustomUser, verbose_name=_('User'), related_name='ratings', on_delete=models.CASCADE)

    def __str__(self):
        return f'action: {self.action[1]}, rating: {self.rating}, user: {self.user}'

    @property
    def action_name(self):
        from apps.courses.models import CourseRatingSystem
        return CourseRatingSystem.ACTIONS[self.action] if self.action in CourseRatingSystem.ACTIONS else ''


class UserFollower(models.Model):
    user = models.ForeignKey(CustomUser, verbose_name=_('Followed User'),
                             related_name='followers', on_delete=models.CASCADE)
    follower = models.ForeignKey(CustomUser, verbose_name=_('Follower'),
                                 related_name='followed_users', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'follower',)
