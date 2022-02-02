# Generated by Django 3.2.7 on 2022-01-10 23:03

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0011_auto_20220110_2302'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courserating',
            name='rating',
            field=models.IntegerField(default=1, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(1)], verbose_name='Rating'),
        ),
    ]
