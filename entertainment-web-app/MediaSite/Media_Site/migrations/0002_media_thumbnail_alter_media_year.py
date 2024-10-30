# Generated by Django 5.1.1 on 2024-09-23 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Media_Site', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='media',
            name='thumbnail',
            field=models.CharField(default='', max_length=128),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='media',
            name='year',
            field=models.IntegerField(),
        ),
    ]
