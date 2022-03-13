# Generated by Django 4.0.2 on 2022-03-08 04:25

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('bread', '0009_alter_order_delivery_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='ship_this',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='Shipment',
            fields=[
                ('index_key', models.AutoField(primary_key=True, serialize=False)),
                ('shipper', models.CharField(choices=[('USPS', 'US Postal Service'), ('FEDEX', 'FedEx'), ('UPS', 'UPS')], default='USPS', max_length=6)),
                ('cost', models.FloatField(null=True)),
                ('tracking_number', models.CharField(blank=True, max_length=100, null=True)),
                ('order_date', models.DateTimeField(default=datetime.datetime(2022, 3, 7, 23, 25, 12, 531918))),
                ('shipping_date', models.DateField(null=True)),
                ('delivery_date', models.DateField(null=True)),
                ('confirmed', models.BooleanField(default=False)),
                ('shipped', models.BooleanField(default=False)),
                ('delivered', models.BooleanField(default=False)),
                ('special_instructions', models.TextField(blank=True, max_length=150, null=True)),
                ('this_is_a_gift', models.BooleanField(default=False)),
                ('meister', models.BooleanField(default=False)),
                ('recipient_name', models.CharField(blank=True, max_length=100, null=True)),
                ('recipient_address', models.CharField(blank=True, max_length=100, null=True)),
                ('recipient_city', models.CharField(blank=True, max_length=100, null=True)),
                ('recipient_state', models.CharField(blank=True, max_length=100, null=True)),
                ('recipient_zip', models.CharField(blank=True, max_length=100, null=True)),
                ('recipient_message', models.TextField(blank=True, max_length=5, null=True)),
                ('cart', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bread.shoppingcart')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='ledger',
            name='shipment_reference',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bread.shipment'),
        ),
        migrations.AddField(
            model_name='order',
            name='shipment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bread.shipment'),
        ),
    ]