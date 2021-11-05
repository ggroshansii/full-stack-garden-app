# Generated by Django 3.2.9 on 2021-11-05 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gardens', '0023_alter_garden_vegetables'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vegetable',
            name='variety',
        ),
        migrations.AddField(
            model_name='garden',
            name='varieties',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='garden',
            name='vegetables',
            field=models.ManyToManyField(blank=True, related_name='vegetables', to='gardens.Vegetable'),
        ),
    ]
