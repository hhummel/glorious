# Generated by Django 4.0.2 on 2022-03-03 02:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bread', '0007_order_recipient_zip_alter_order_recipient_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='cart',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bread.shoppingcart'),
        ),
    ]
