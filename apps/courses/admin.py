from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Course, CourseChapter, CourseSubcategory, CourseMainCategory, CourseChapterComment


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'category')
    ordering = ('title',)
    search_fields = ('title', 'category')


@admin.register(CourseChapter)
class CourseChapterAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'course')
    ordering = ('title',)
    search_fields = ('course', )


@admin.register(CourseSubcategory)
class CourseSubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'main_category')
    ordering = ('main_category', 'name')
    search_fields = ('main_category', 'name')


@admin.register(CourseMainCategory)
class CourseMainCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', )
    ordering = ('name', )
    search_fields = ('name', )

@admin.register(CourseChapterComment)
class CourseChapterCommentAdmin(admin.ModelAdmin):
    list_display = ('content', 'author', 'chapter' )
    ordering = ('content', )
    search_fields = ('content', 'author', 'chapter')
