# Generated by Django 3.2.7 on 2022-01-10 23:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0014_delete_courserating'),
    ]

    operations = [
        migrations.AddField(
            model_name='usercourserating',
            name='content',
            field=models.CharField(default='', max_length=500),
        ),
    ]