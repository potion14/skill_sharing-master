# Generated by Django 3.2.7 on 2021-11-11 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_courseauthor_courseparticipant'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='username',
            field=models.CharField(default=1, max_length=256, unique=True, verbose_name='Username'),
            preserve_default=False,
        ),
    ]
