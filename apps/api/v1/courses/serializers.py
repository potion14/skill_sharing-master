from rest_framework import serializers

from rest_framework_recursive.fields import RecursiveField

from apps.courses import models


class CourseSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%m-%d-%Y', read_only=True)
    creator = serializers.SerializerMethodField()
    chapters = serializers.SerializerMethodField()
    co_creators = serializers.SerializerMethodField()
    main_category = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    rating_amount = serializers.SerializerMethodField()
    user_can_edit = serializers.SerializerMethodField()
    user_can_view = serializers.SerializerMethodField()
    user_can_join = serializers.SerializerMethodField()

    class Meta:
        read_only_fields = [
            "created_at",
        ]
        model = models.Course
        fields = ['id', 'title', 'category', 'created_at', 'creator', 'co_creators', 'chapters', 'main_category',
                  'rating', 'rating_amount', 'user_can_edit', 'user_can_view', 'user_can_join', 'price']

    def get_creator(self, obj):
        from apps.api.v1.users.serializers import UserSerializer
        serializer = UserSerializer(obj.creator)
        return serializer.data

    def get_co_creators(self, obj):
        from apps.api.v1.users.serializers import UserSerializer
        co_creators = obj.get_co_creators()
        serializer = UserSerializer(co_creators, many=True)
        return serializer.data

    def get_chapters(self, obj):
        user = self.context.get('user')
        chapters = obj.get_chapters()
        serializer = ChapterSerializer(chapters, many=True, context={'user': user})
        return serializer.data

    def get_main_category(self, obj):
        if obj.category and obj.category.main_category:
            return obj.category.main_category.id
        else:
            return ''

    def get_rating(self, obj):
        ratings = models.UserCourseRating.objects.filter(course_id=obj.id)
        rating_count = ratings.count()
        rating_sum = 0

        for rating in ratings:
            rating_sum += rating.rating

        if rating_sum:
            return rating_sum // rating_count
        else:
            return 0

    def get_rating_amount(self, obj):
        rating_count = models.UserCourseRating.objects.filter(course_id=obj.id).count()
        return rating_count

    def get_user_can_edit(self, obj):
        user = self.context.get('user')

        return True if user == obj.creator else False

    def get_user_can_view(self, obj):
        user = self.context.get('user')

        if user == obj.creator:
            return True

        for participant in obj.participants.all():
            if participant.participant == user:
                return True

        for co_creator in obj.co_creators.all():
            if co_creator.co_creator == user:
                return True

        return False

    def get_user_can_join(self, obj):
        user = self.context.get('user')

        if user == obj.creator:
            return False

        for participant in obj.participants.all():
            if participant.participant == user:
                return False

        for co_creator in obj.co_creators.all():
            if co_creator.co_creator == user:
                return False

        if user.points >= obj.price:
            return True


class ChapterSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%m-%d-%Y', read_only=True)
    user_can_edit = serializers.SerializerMethodField()

    class Meta:
        read_only_fields = [
            "created_at",
        ]
        model = models.CourseChapter
        fields = ['id', 'title', 'content', 'created_at', 'course', 'user_can_edit']

    def get_user_can_edit(self, obj):
        user = self.context.get('user')

        if user == obj.course.creator:
            return True

        for co_creator in obj.course.co_creators.all():
            if co_creator.co_creator == user:
                return False

        return False


class UserCourseRatingSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%m-%d-%Y %H:%M', read_only=True)
    author = serializers.SerializerMethodField()

    class Meta:
        read_only_fields = [
            "created_at",
        ]
        model = models.UserCourseRating
        fields = ['id', 'course', 'rating', 'author', 'content', "created_at"]

    def get_author(self, obj):
        from apps.api.v1.users.serializers import UserSerializer
        serializer = UserSerializer(obj.creator)
        return serializer.data


class CourseChapterCommentSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%d-%m-%Y %H:%M', read_only=True)
    author = serializers.SerializerMethodField()
    replies = RecursiveField(source='replies.all', many=True, read_only=True)

    class Meta:
        read_only_fields = [
            "created_at",
        ]
        model = models.CourseChapterComment
        fields = ['id', 'chapter', 'content', 'replies', 'author',  "created_at", "reply_to"]

    def get_author(self, obj):
        from apps.api.v1.users.serializers import UserSerializer
        serializer = UserSerializer(obj.author)
        return serializer.data


class CourseSubCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = models.CourseSubcategory
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = models.CourseMainCategory
        fields = ['id', 'name', 'subcategories']


    def get_subcategories(self, obj):
        chapters = obj.subcategories.all()
        serializer = CourseSubCategorySerializer(chapters, many=True)
        return serializer.data



