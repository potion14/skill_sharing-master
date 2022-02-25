from django.test import TestCase
from django.urls import reverse, reverse_lazy

from apps.users.models import CustomUser as User
from apps.courses.models import CourseSubcategory, CourseMainCategory, Course, CourseChapter, CourseChapterComment


class TestCourses(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()

    def test_add_course(self):
        self.client.force_login(user=self.user)

        data = {
            'title': 'test title',
            'visibility': 1,
            'category': self.sub_category.id,
        }

        response = self.client.post(reverse('api:v1:courses:course-list'), data=data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Course.objects.count(), 1)
        self.assertEqual(Course.objects.first().title, 'test title')
        self.assertEqual(Course.objects.first().visibility, 1)
        self.assertEqual(Course.objects.first().category_id, self.sub_category.id)
        self.assertEqual(Course.objects.first().creator, self.user)

    def test_list_view(self):
        self.client.force_login(user=self.user)
        Course.objects.create(title='test', visibility=1, category=self.sub_category,
                              creator=self.user)
        response = self.client.get(reverse('api:v1:courses:course-list'))
        self.assertEqual(response.status_code, 200)

    def test_list_view_without_authorization(self):
        response = self.client.get(reverse('api:v1:courses:course-list'))
        self.assertEqual(response.status_code, 403)


class TestChapters(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()
        self.course = Course.objects.create(title='test', visibility=1, category=self.sub_category, creator=self.user)

    def test_add_chapter(self):
        self.client.force_login(user=self.user)

        data = {
            'title': 'test title',
            'content': 'test test test content',
            'course': self.course.id
        }

        response = self.client.post(reverse_lazy('api:v1:courses:course_chapters-list',
                                                 kwargs={'course_pk': self.course.id}), data=data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(CourseChapter.objects.count(), 1)
        self.assertEqual(CourseChapter.objects.filter(course_id=self.course.id).count(), 1)

    def test_list_view(self):
        self.client.force_login(user=self.user)
        CourseChapter.objects.create(title='test', content='test test test', course=self.course)
        response = self.client.get(reverse_lazy('api:v1:courses:course_chapters-list',
                                                kwargs={'course_pk': self.course.id}))
        self.assertEqual(response.status_code, 200)

    def test_list_view_without_authorization(self):
        response = self.client.get(reverse_lazy('api:v1:courses:course_chapters-list',
                                                kwargs={'course_pk': self.course.id}))
        self.assertEqual(response.status_code, 403)


class TestChapterComments(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()
        self.course = Course.objects.create(title='test', visibility=1, category=self.sub_category, creator=self.user)
        self.chapter = CourseChapter.objects.create(title='test', content='test test test', course=self.course)

    def test_add_comment(self):
        self.client.force_login(user=self.user)

        data = {
            'content': 'test test test content',
            'chapter': self.chapter.id,
        }

        response = self.client.post(reverse_lazy('api:v1:courses:course_chapter_comments-list',
                                                 kwargs={'chapter_pk': self.chapter.id}), data=data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(CourseChapterComment.objects.count(), 1)
        self.assertEqual(CourseChapterComment.objects.filter(chapter_id=self.chapter.id).count(), 1)

    def test_list_view(self):
        self.client.force_login(user=self.user)
        CourseChapterComment.objects.create(content='test test test', chapter=self.chapter, author=self.user)
        response = self.client.get(reverse_lazy('api:v1:courses:course_chapter_comments-list',
                                                 kwargs={'chapter_pk': self.chapter.id}))
        self.assertEqual(response.status_code, 200)

    def test_list_view_without_authorization(self):
        response = self.client.get(reverse_lazy('api:v1:courses:course_chapter_comments-list',
                                                 kwargs={'chapter_pk': self.chapter.id}))
        self.assertEqual(response.status_code, 403)


class TestMyCoursesView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()
        self.course = Course.objects.create(title='test', visibility=1, category=self.sub_category,
                              creator=self.user)

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:courses:my_courses'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:courses:my_courses'))
        self.assertEqual(response.status_code, 403)


class TestStartedCoursesView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()
        self.course = Course.objects.create(title='test', visibility=1, category=self.sub_category,
                              creator=self.user)

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:courses:started_courses'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:courses:started_courses'))
        self.assertEqual(response.status_code, 403)


class TestCourseRankingView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()
        self.course = Course.objects.create(title='test', visibility=1, category=self.sub_category,
                              creator=self.user)

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:courses:top_courses'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:courses:top_courses'))
        self.assertEqual(response.status_code, 403)


class TestFollowedCourseView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()
        self.course = Course.objects.create(title='test', visibility=1, category=self.sub_category,
                              creator=self.user)

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:courses:followed-users-courses'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:courses:followed-users-courses'))
        self.assertEqual(response.status_code, 403)


class TestCategoryView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:courses:main_categories'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:courses:main_categories'))
        self.assertEqual(response.status_code, 200)


class TestSubcategoriesView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')
        self.category = CourseMainCategory(name='test_main')
        self.category.save()
        self.sub_category = CourseSubcategory(name='test_sub', main_category=self.category)
        self.sub_category.save()

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:courses:subcategories'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:courses:subcategories'))
        self.assertEqual(response.status_code, 200)


class TestCourseVisibilityView(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='foo@foo.pl', password='bar', username='test')

    def test_with_authorization(self):
        self.client.force_login(user=self.user)
        response = self.client.get(reverse('api:v1:courses:course-visibility'))
        self.assertEqual(response.status_code, 200)

    def test_without_authorization(self):
        response = self.client.get(reverse('api:v1:courses:course-visibility'))
        print(response)
        self.assertEqual(response.status_code, 200)





