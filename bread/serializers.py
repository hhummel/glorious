from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import Contacts, Category, Products, Order, Subscription
from .models import Subscribers, MailList, Campaign, ShoppingCart, Gift, Payment, Ledger


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_superuser', 'is_staff', 'is_active', 'password']
        read_only_fields = ('id',)
        extra_kwargs = {'password': {'write_only': True}}

class ContactsSerializer(serializers.ModelSerializer):
    """Serializer for Contacts"""
    password=serializers.CharField(write_only=True)

    class Meta:
        model = Contacts
        fields = '__all__'
        read_only_fields = ('index_key', 'user', 'creation',)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            is_superuser=False,
            is_staff=False,
            is_active=True,
            password = make_password(validated_data['password']),
        )

        validated_data.pop('password')

        contact = Contacts.objects.create(
            user=user,
            **validated_data,
        )

        return contact

class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category"""
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('index_key',)


class ProductsSerializer(serializers.ModelSerializer):
    """Serializer for Product"""
    class Meta:
        model = Products
        fields = '__all__'
        read_only_fields = ('index_key', 'category',)


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order"""
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('index_key', 'user', 'product', 'order_date',)


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for Bread Subscription"""
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ('index_key', 'user',)


class PaymentSerializer(serializers.ModelSerializer):
    """Serilizer for Payment"""
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('index_key', 'user', 'date',)


class LedgerSerializer(serializers.ModelSerializer):
    """Serializer for Ledger"""
    class Meta:
        model = Ledger
        fields = '__all__'
        read_only_fields = ('index_key', 'user', 'order_reference', 'payment_reference', 'expense_reference', 'date',)


class GiftSerializer(serializers.ModelSerializer):
    """Serializer for Gift"""
    class Meta:
        model = Gift
        fields = '__all__'
        read_only_fields = ('index_key', 'order',)


class SubscribersSerializer(serializers.ModelSerializer):
    """Serializer for Mail List Subscriber"""
    class Meta:
        model = Subscribers
        fields = '__all__'
        read_only_fields = ('index_key', 'user_id', 'creation',)


class MailListSerializer(serializers.ModelSerializer):
    """Serializer for Mail List"""
    class Meta:
        model = MailList
        fields = '__all__'
        read_only_fields = ('index_key',)


class CampaignSerializer(serializers.ModelSerializer):
    """Serializer for Campaign"""
    class Meta:
        model = Campaign
        fields = '__all__'
        read_only_fields = ('index_key', 'mail_list', 'date',)


class ShoppingCartSerializer(serializers.ModelSerializer):
    """Serializer for ShoppingCart"""
    class Meta:
        model = ShoppingCart
        fields = '__all__'
        read_only_fields = ('index_key', 'user', 'date',)


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
