# Generated by Django 4.0.4 on 2022-05-08 00:05

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bread', '0011_alter_order_delivery_date_alter_shipment_order_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='refund',
            name='cart',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bread.shoppingcart'),
        ),
        migrations.AlterField(
            model_name='order',
            name='delivery_date',
            field=models.DateField(default=datetime.date(2022, 5, 10)),
        ),
        migrations.AlterField(
            model_name='shipment',
            name='order_date',
            field=models.DateTimeField(default=datetime.datetime(2022, 5, 7, 20, 5, 24, 701208)),
        ),
    ]