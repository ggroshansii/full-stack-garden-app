# Generated by Django 3.2.9 on 2021-11-17 14:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gardens', '0029_auto_20211112_0112'),
    ]

    operations = [
        migrations.AlterField(
            model_name='garden',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
