# Generated by Django 3.2.9 on 2021-11-04 15:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gardens', '0018_garden_layout'),
    ]

    operations = [
        migrations.AddField(
            model_name='vegetable',
            name='variety',
            field=models.CharField(blank=True, max_length=75, null=True),
        ),
    ]