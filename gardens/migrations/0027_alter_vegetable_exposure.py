# Generated by Django 3.2.9 on 2021-11-07 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gardens', '0026_alter_vegetable_exposure'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vegetable',
            name='exposure',
            field=models.CharField(choices=[('FS', 'FS'), ('PS', 'PS'), ('BO', 'BO')], max_length=4),
        ),
    ]
