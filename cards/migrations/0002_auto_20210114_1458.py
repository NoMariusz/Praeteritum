# Generated by Django 3.1.5 on 2021-01-14 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cardmodel',
            name='attack',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='cardmodel',
            name='hp',
            field=models.PositiveIntegerField(),
        ),
    ]