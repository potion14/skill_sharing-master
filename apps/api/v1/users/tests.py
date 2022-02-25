from django.test import TestCase
from django.urls import reverse, reverse_lazy

from apps.courses.models import Course, CourseMainCategory, CourseSubcategory
from apps.users.models import CustomUser as User


class TestUserPointsView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:users:my_points'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:users:my_points'))
        self.assertEqual(response.status_code, 403)


class TestUserRatingsView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:users:my_ratings'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:users:my_ratings'))
        self.assertEqual(response.status_code, 403)


class TestUsers(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')

    def test_list_view(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:users:user-list'))
        self.assertEqual(response.status_code, 200)

    def test_list_view_without_authorization(self):
        response = self.client.get(reverse('api:v1:users:user-list'))
        self.assertEqual(response.status_code, 403)


class TestUserFollowersListView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse_lazy('api:v1:users:user_followers', kwargs={'user_pk': self.user.id}))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:users:user_followers', kwargs={'user_pk': self.user.id}))
        self.assertEqual(response.status_code, 403)


class TestFollowingUsersListView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse_lazy('api:v1:users:following_users', kwargs={'user_pk': self.user.id}))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:users:following_users', kwargs={'user_pk': self.user.id}))
        self.assertEqual(response.status_code, 403)


class TestUserInfoView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse_lazy('api:v1:users:user-info'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:users:user-info'))
        self.assertEqual(response.status_code, 403)


class TestUserInfoInCourseView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()
        self.course = Course.objects.create(title='test', visibility=1, category=self.sub_category, creator=self.user)

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse_lazy('api:v1:users:user_info_in_course',
                                                kwargs={'user_pk': self.user.id, 'course_pk': self.course.id}))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:users:user_info_in_course',
                                           kwargs={'user_pk': self.user.id, 'course_pk': self.course.id}))
        self.assertEqual(response.status_code, 403)


class TestUserFollowerInfoView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.user2 = User.objects.create_user(email='foo2@foo.pl', password='bar', username='test2')

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse_lazy('api:v1:users:user-follower-info',
                                                kwargs={'follower_pk': self.user.id,
                                                        'followed_user_pk': self.user2.id}))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse_lazy('api:v1:users:user-follower-info',
                                                kwargs={'follower_pk': self.user.id,
                                                        'followed_user_pk': self.user2.id}))
        self.assertEqual(response.status_code, 403)


class TestNewCourseParticipantView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.user2 = User.objects.create_user(email='foo2@foo.pl', password='bar', username='test2')

        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()
        self.course = Course.objects.create(title='test', visibility=1, category=self.sub_category,
                              creator=self.user)

    def test_add_participant(self):
        self.client.force_login(user=self.user)

        data = {
            'participant': self.user2.id,
            'course': self.course.id,
            'is_active': True,
        }

        response = self.client.post(reverse('api:v1:users:new_course_participant'), data=data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.course.participants.count(), 1)

    def test_add_participant_without_authorization(self):
        data = {
            'participant': self.user2.id,
            'course': self.course.id,
            'is_active': True,
        }

        response = self.client.post(reverse('api:v1:users:new_course_participant'), data=data)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.course.participants.count(), 0)


class TestNewCourseCoCreatorView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.user2 = User.objects.create_user(email='foo2@foo.pl', password='bar', username='test2')

        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()
        self.course = Course.objects.create(title='test', visibility=1, category=self.sub_category,
                                            creator=self.user)

    def test_add_co_creator(self):
        self.client.force_login(user=self.user)

        data = {
            'co_creator': self.user2.id,
            'course': self.course.id,
            'is_active': True,
        }

        response = self.client.post(reverse('api:v1:users:new_course_co_creator'), data=data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.course.co_creators.count(), 1)

    def test_add_co_creator_without_authorization(self):
        data = {
            'co_creator': self.user2.id,
            'course': self.course.id,
            'is_active': True,
        }

        response = self.client.post(reverse('api:v1:users:new_course_co_creator'), data=data)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.course.co_creators.count(), 0)


class TestNewFollowerView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.user2 = User.objects.create_user(email='foo2@foo.pl', password='bar', username='test2')

    def test_add_follower(self):
        self.client.force_login(user=self.user)

        data = {
            'user': self.user2.id,
            'follower': self.user.id
        }

        response = self.client.post(reverse('api:v1:users:new_follower'), data=data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.user.followed_users.count(), 1)
        self.assertEqual(self.user2.followers.count(), 1)

    def test_add_follower_without_authorization(self):
        data = {
            'user': self.user2.id,
            'follower': self.user.id
        }

        response = self.client.post(reverse('api:v1:users:new_follower'), data=data)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(self.user.followed_users.count(), 0)
        self.assertEqual(self.user2.followers.count(), 0)
