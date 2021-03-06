# Generated by Django 3.2.7 on 2022-02-08 23:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0019_remove_course_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='visibility',
            field=models.IntegerField(choices=[(1, 'Everyone'), (2, 'Participants'), (3, 'Authors'), (4, 'Followers')], default=3, verbose_name='Visibility'),
        ),
    ]
