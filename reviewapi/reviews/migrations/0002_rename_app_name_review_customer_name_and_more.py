# Generated by Django 5.2.3 on 2025-06-30 12:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='review',
            old_name='app_name',
            new_name='customer_name',
        ),
        migrations.RenameField(
            model_name='review',
            old_name='reviewer',
            new_name='served_by',
        ),
    ]
