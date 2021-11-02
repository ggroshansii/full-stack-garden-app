# Generated by Django 3.2.8 on 2021-11-02 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gardens', '0009_garden_soil'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vegetables',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exposure', models.CharField(choices=[('FS', 'FS'), ('PS', 'PS')], max_length=4)),
                ('life_cycle', models.CharField(choices=[('AN', 'AN'), ('BI', 'BI'), ('PE', 'PE')], max_length=4)),
                ('seasonality', models.CharField(choices=[('CS', 'CS'), ('WS', 'WS')], max_length=4)),
                ('heat_tolerant', models.BooleanField()),
                ('drought_tolerant', models.BooleanField()),
            ],
        ),
    ]
