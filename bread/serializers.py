from django.contrib.auth.models import User
from rest_framework import serializers

from .models import EXCLUDED_DAYS, Contacts, Category, Products, Order, Subscription, Gift, Payment, Ledger
from .models import Subscribers, MailList, Campaign


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_superuser', 'is_staff', 'is_active']
        read_only_fields = ('id',)

class ContactsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacts
        fields = '__all__'
        read_only_fields = ('index_key', 'user', 'creation',)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('index_key',)


class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = '__all__'
        read_only_fields = ('index_key', 'category',)


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('index_key', 'user', 'product', 'order_date',)

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ('index_key', 'user',)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('index_key', 'user', 'date',)


class LedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ledger
        fields = '__all__'
        read_only_fields = ('index_key', 'user', 'order_reference', 'payment_reference', 'expense_reference', 'date',)


class GiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gift
        fields = '__all__'
        read_only_fields = ('index_key', 'order',)


class SubscribersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscribers
        fields = '__all__'
        read_only_fields = ('index_key', 'user_id', 'creation',)


class MailListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailList
        fields = '__all__'
        read_only_fields = ('index_key',)


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'
        read_only_fields = ('index_key', 'mail_list', 'date',)
