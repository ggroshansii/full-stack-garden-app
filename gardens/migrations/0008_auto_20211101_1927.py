# Generated by Django 3.2.8 on 2021-11-01 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gardens', '0007_soil_soil_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='soil',
            name='characteristics',
            field=models.CharField(max_length=1000),
        ),
        migrations.AlterField(
            model_name='soil',
            name='recommendations',
            field=models.CharField(max_length=1000),
        ),
    ]
