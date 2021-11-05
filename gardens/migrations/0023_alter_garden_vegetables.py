# Generated by Django 3.2.9 on 2021-11-04 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gardens', '0022_alter_garden_vegetables'),
    ]

    operations = [
        migrations.AlterField(
            model_name='garden',
            name='vegetables',
            field=models.ManyToManyField(blank=True, null=True, related_name='vegetables', to='gardens.Vegetable'),
        ),
    ]