from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone

from model_utils import Choices


class CourseMainCategory(models.Model):
    name = models.CharField(max_length=256, default='New topic')

    def __str__(self):
        return self.name


class CourseSubcategory(models.Model):
    name = models.CharField(max_length=256, default='New topic')
    main_category = models.ForeignKey(CourseMainCategory, verbose_name=_('Main Category'),
                                      related_name='subcategories', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Course(models.Model):
    VISIBILITY = Choices(
        (1, 'everyone', _('Everyone')),
        (2, 'participants', _('Participants')),
        (3, 'authors', _('Authors')),
    )

    title = models.CharField(max_length=256, default='New course')
    created_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    visibility = models.IntegerField(_('Visibility'), choices=VISIBILITY, default=VISIBILITY.authors)
    category = models.ForeignKey(CourseSubcategory, verbose_name=_('Category'),
                                 related_name='courses', on_delete=models.CASCADE)

    from apps.users.models import CustomUser as User
    creator = models.ForeignKey(User, verbose_name=_('Creator'),
                                related_name='courses_created', on_delete=models.CASCADE)
    price = models.IntegerField(_('Price'), default=10,
                                validators=[
                                     MaxValueValidator(200),
                                     MinValueValidator(10)
                                 ])

    def __str__(self):
        return self.title

    def get_chapters(self):
        return self.chapters.all()

    def get_co_creators(self):
        co_creators = []
        for co_creator in self.co_creators.all():
            co_creators.append(co_creator.co_creator)
        return co_creators


class CourseChapter(models.Model):
    title = models.CharField(max_length=256, default='New topic')
    content = models.CharField(max_length=10000, default='')
    created_at = models.DateTimeField(default=timezone.now)
    course = models.ForeignKey(Course, verbose_name=_('Course'), on_delete=models.CASCADE, related_name='chapters')

    def __str__(self):
        return self.title


class CourseChapterComment(models.Model):
    content = models.CharField(max_length=500, default='')
    created_at = models.DateTimeField(default=timezone.now)
    chapter = models.ForeignKey(CourseChapter, verbose_name=_('Chapter'), on_delete=models.CASCADE,
                                related_name='comments')
    from apps.users.models import CustomUser as User
    author = models.ForeignKey(User, verbose_name=_('Author'), related_name='comments', on_delete=models.CASCADE)
    reply_to = models.ForeignKey(
        'CourseChapterComment', on_delete=models.SET_NULL, verbose_name=_('Reply to'), related_name='replies',
        null=True, blank=True)

    def __str__(self):
        return self.content


class CourseRatingSystem(models.Model):
    ACTIONS = Choices(
        (1, 'new_comment_co', _('Points for new comment for course owner')),
        (2, 'new_comment_cc', _('Points for new comment for co-creators')),
        (3, 'new_participant_cc', _('Points for new participant for co-creators')),
        (4, 'new_participant_co', _('Points for new participant for course owner')),
        (5, 'new_rating_co', _('Points for new rating for course owner')),
        (6, 'new_rating_co', _('Points for new rating for co-creator')),
        (7, 'course_owner_activity_in_course',  _('New course owner activity in course')),
        (8, 'co-creator_activity_in_course', _('New co-creator activity in course'))
    )
    action = models.IntegerField(_('Action'), choices=ACTIONS, unique=True)
    rating = models.IntegerField(_('Rating'), default=1,
                                 validators=[
                                     MaxValueValidator(100),
                                     MinValueValidator(1)
                                 ])

    def __str__(self):
        return f'action: {self.action[1]}, rating: {self.rating}'


class UserCourseRating(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    course = models.ForeignKey(Course, verbose_name=_('Course'), on_delete=models.CASCADE, related_name='user_ratings')
    rating = models.IntegerField(_('Rating'), default=1, validators=[
                                                             MaxValueValidator(5),
                                                             MinValueValidator(1)
                                                         ])
    from apps.users.models import CustomUser as User
    author = models.ForeignKey(User, verbose_name=_('Author'), related_name='issued_ratings', on_delete=models.SET_NULL,
                               null=True, blank=True)
    content = models.CharField(max_length=500, default='')

    def __str__(self):
        return f'action: {self.action[1]}, rating: {self.rating}'

