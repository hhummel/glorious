from calendar import c
from configparser import NoOptionError
from decimal import Decimal
import json
import os
import logging
from datetime import datetime
from uuid import uuid4
from time import time

from django.conf import settings
from django.db import transaction
from django.http import HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.urls import reverse
from django.db.models import Sum
from django.http import JsonResponse
from django.core import serializers
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.dispatch import receiver

from rest_framework import viewsets, permissions, status, mixins, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated 
import django_filters.rest_framework
from django_rest_passwordreset.signals import reset_password_token_created

import requests
import stripe
import xmltodict

from .forms import ContactForm, OrderForm, OrderMeisterForm, PaymentForm, UnsubscribeForm
from .forms import CampaignForm, MailListForm, SubscriptionForm, MaterialsForm
from .models import Contacts, Subscribers, Order, Ledger, Payment, MailList, PaymentIntent, Category
from .models import Products, Subscription, Gift, Campaign, ShoppingCart
from .models import EXCLUDED_DAYS, MEISTER_EXCLUDED_DAYS, UNITS
from glorious.passwords import EMAIL_SERVER, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, \
    EMAIL_SENDER, EMAIL_ASSISTANT, SIGNATURE, EMAIL_FOOTER, HTML_FOOTER, STRIPE_SECRET, STRIPE_WEBHOOK_SECRET,\
    STRIPE_PUBLISHABLE, HISTORY, USPS_USER_ID
from .bread import make_msg, write_log_message, mailer
from .serializers import ContactsSerializer, CategorySerializer, ProductsSerializer, \
    OrderSerializer, SubscriptionSerializer, GiftSerializer, PaymentSerializer, \
    LedgerSerializer, SubscribersSerializer, MailListSerializer, CampaignSerializer, \
    UserSerializer, ChangePasswordSerializer
from .permissions import IsOwnerOrAdmin, IsAdminOrReadOnly
from .shipping import create_shipping_objects, get_shipping_cost, get_shipping_list

# Path to  output file
log_file = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', 'log/message.log'))
logger = logging.Logger('bread')

stripe.api_key = STRIPE_SECRET

# Logo images
logo_image = "images/logo_baked_transparent.png"
small_logo = "images/small_loaf.png"

# Roller image
roller_image = "images/wheat_sheaf_transparent.jpg"

# Dough gif
dough_gif = "images/dough.gif"

# slices image
slices_image = "images/slices.jpg"

# Breadmeister data
assistant_meister = EMAIL_ASSISTANT
breadmeister_address = EMAIL_SENDER
sender_address = "Glorious Grain <" + EMAIL_SENDER + ">"

# Card payment message
card_message = "Pay off current balance"


# DRF views
class CreateListRetrieveViewSet(mixins.CreateModelMixin,
                                mixins.ListModelMixin,
                                mixins.RetrieveModelMixin,
                                viewsets.GenericViewSet):
    """
    A viewset that provides `retrieve`, `create`, and `list` actions.
    Excludes 'update', 'partial_update' and 'destroy'
    """
    pass

class ContactsViewSet(viewsets.ModelViewSet):
    queryset = Contacts.objects.all()
    serializer_class = ContactsSerializer
    permission_classes = [IsOwnerOrAdmin,]


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly,]


class ProductsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductsSerializer
    permission_classes = [IsAdminOrReadOnly,]


class OrderViewSet(CreateListRetrieveViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsOwnerOrAdmin,]
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['user']

    @action(detail=True, methods=["get"])
    def pending(self, request, pk):
        today = timezone.datetime.today().date()

        pending_orders = self.queryset. \
            filter(user=request.user). \
            filter(delivery_date__gte=today). \
            filter(confirmed=True). \
            order_by('delivery_date')
        serializer = self.get_serializer(pending_orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def history(self, request, pk):
        today = timezone.datetime.today().date()
        past_orders = self.queryset. \
            filter(user=request.user). \
            filter(confirmed=True). \
            filter(delivery_date__lt=today). \
            order_by('-delivery_date')
        serializer = self.get_serializer(past_orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsOwnerOrAdmin,]


class GiftViewSet(viewsets.ModelViewSet):
    queryset = Gift.objects.all()
    serializer_class = GiftSerializer
    permission_classes = [IsOwnerOrAdmin,]


class PaymentViewSet(CreateListRetrieveViewSet):
    queryset = Payment.objects.all().order_by('-date')
    serializer_class = PaymentSerializer
    permission_classes = [IsOwnerOrAdmin,]
    filterset_fields = ['user']

    @action(detail=True, methods=["get"]) 
    def user(self, request, pk): 
        user_payments = self.queryset.filter(user=request.user).order_by('-date')
        serializer = self.get_serializer(user_payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LedgerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ledger.objects.all()
    serializer_class = LedgerSerializer
    permission_classes = [IsOwnerOrAdmin,]
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['user']

    @action(detail=True, methods=["get"])
    def debits(self, request, pk):
        debits = self.queryset.filter(user=request.user). \
            filter(credit=False).filter(cancelled=False).order_by('-date')
        serializer = self.get_serializer(debits, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def credits(self, request, pk): 
        credits = self.queryset.filter(user=request.user). \
            filter(credit=True).filter(cancelled=False).order_by('-date')
        serializer = self.get_serializer(credits, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SubscribersViewSet(viewsets.ModelViewSet):
    queryset = Subscribers.objects.all()
    serializer_class = SubscribersSerializer
    permission_classes = [IsOwnerOrAdmin,]


class MailListViewSet(viewsets.ModelViewSet):
    queryset = MailList.objects.all()
    serializer_class = MailListSerializer
    permission_classes = [permissions.IsAdminUser,]


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAdminUser,]


# Views for session authentication with DRF
@api_view(["POST"])
def session_login(request):
    username = request.data['username']
    password = request.data['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
def session_logout(request):
    logout(request)
    return Response(status=status.HTTP_200_OK)


# Views returning json

@api_view(["POST"])
def validate_address(request):
    address = request.data['address']
    city = request.data['city']
    state = request.data['state']

    xml_body = f'<AddressValidateRequest USERID="{USPS_USER_ID}"><Address ID="1">' \
        f'<Address1>{address}</Address1><Address2></Address2><City>{city}</City>' \
        f'<State>{state}</State><Zip5></Zip5><Zip4></Zip4></Address></AddressValidateRequest>'

    data = {
        'API': "Verify",
        'XML': xml_body
    }

    headers = {
      'Content-Type': 'text/xml',
    }
    try:
        res = requests.post("https://secure.shippingapis.com/ShippingAPI.dll", data=data, headers=headers)
        logger.info(f'Address validation status: {res.status_code} text: {res.text}')
        address_dict = xmltodict.parse(res.text).get('AddressValidateResponse').get('Address')
        validated = {
            'address': address_dict.get('Address2'),
            'city': address_dict.get('City'),
            'state': address_dict.get('State'),
            'zip5': address_dict.get('Zip5'),
            'zip4': address_dict.get('Zip4'),
        }

        return (Response(status=res.status_code, data=json.dumps(validated)))
    except Exception as e:
        logger.error(f'Address validation failed: {e}')


class Intent():
    """Locally created intent object parallel to one created in Stripe"""
    def __init__(self, amount):
        self.id = uuid4()
        self.client_secret = self.id
        self.amount = amount
        self.created = int(time())


def create_ledger_payment(payment_intent, payment, non_cash=False):
    """Create a Ledger entry for payment"""
    Ledger.objects.create(
        user=payment_intent.user,
        quantity=payment_intent.value,
        credit=True,
        non_cash=non_cash,
        cancelled=False,
        order_reference=None,
        payment_reference=payment,
        expense_reference=None,
        date=timezone.datetime.now(tz=timezone.utc),
    )


def create_ledger_orders(payment_intent):
    """Create a Ledger object for each Order item in Shopping Cart"""
    cart = payment_intent.cart
    orders = cart.order_set.all()
    for order in orders:
        quantity = order.product.price * order.number 
        Ledger.objects.create(
            user=order.user,
            quantity=quantity,
            credit=False,
            non_cash=True,
            cancelled=False,
            order_reference=order,
            payment_reference=None,
            expense_reference=None,
            date=timezone.datetime.now(tz=timezone.utc),
    )


@api_view(['POST'])
@transaction.atomic
def payment_intent(request):
    payment_method = request.data['payment_method'] 
    orders = json.loads(request.data['cart'])

    # Make a ShoppingCart
    cart = ShoppingCart.objects.create(
        user = request.user,
        date = timezone.datetime.now(tz=timezone.utc),
        confirmed = False,
    )

    product_cost = 0

    # Make Orders
    for order in orders:
        product = Products.objects.get(index_key=order['product']['index_key'])
        product_cost += order['number'] * product.price

        Order.objects.create(
            user=request.user,
            product=product,
            number=order['number'],
            delivery_date=order['delivery_date'][:-14],
            order_date=timezone.datetime.now(tz=timezone.utc),
            standing=order['standing'],
            confirmed=True,
            delivered=order['delivered'],
            meister=order['meister'],
            special_instructions=order.get('special_instructions'),
            this_is_a_gift=order['this_is_a_gift'],
            ship_this=order['ship_this'],
            recipient_name=order.get('recipient_name'),
            recipient_address=order.get('recipient_address'),
            recipient_city=order.get('recipient_city'),
            recipient_state=order.get('recipient_state'),
            recipient_zip=order.get('recipient_zip'),
            recipient_message=order.get('recipient_message'),
            cart=cart,
        )

    shipping_cost = get_shipping_cost(get_shipping_list(cart))
    total_cost = product_cost + shipping_cost

    if payment_method == 'CRD':
        # Get intent from Stripe
        stripe.api_key = STRIPE_SECRET

        intent = stripe.PaymentIntent.create(
            amount = total_cost * 100,
            currency = 'usd',
            automatic_payment_methods = {"enabled": True},
        )

        if not intent:
            return Response(status=status.HTTP_402_PAYMENT_REQUIRED, data="Payment Intent Id not found")
    else:
        # Create an intent id here
        intent = Intent(total_cost)


    #Make PaymentIntent
    payment_intent_object = PaymentIntent.objects.create(
        user = request.user,
        value = round(intent.amount/100, 2),
        date = timezone.datetime.fromtimestamp(intent.created, tz=timezone.utc),
        payment_method = payment_method,
        payment_reference = None,
        payment_intent_id = intent.id,
        success = None,
        cart=cart,
    )

    if payment_method in ['CSH', 'CHK', 'VEN']:
        # Payment is on trade credit, so create Ledger entry for Orders
        create_ledger_orders(payment_intent=payment_intent_object)
        create_shipping_objects(cart=payment_intent_object.cart)

    return Response({
        'client_secret': intent.client_secret, 
        'product_cost': product_cost,
        'shipping_cost': shipping_cost,
    })

@transaction.atomic
def handle_payment_intent_succeeded(id):
    """ 
    Handle payment success for CRD by updating PaymentIntent and creating ShoppingCart, Payment and Orders"""

    payment_intent=PaymentIntent.objects.get(payment_intent_id=id)

    # No action if status has been set take for idempotency
    if payment_intent.success is not None:
        return
    
    # Create a Payment if PaymentIntent is CRD and payment has been made
    payment = Payment.objects.create(
        user=payment_intent.user,
        value=-payment_intent.value,
        date=timezone.datetime.now(tz=timezone.utc),
        payment_method='CRD',
        confirmed=True,
        cart=payment_intent.cart
    )

    # Create a Ledger entry for payment
    create_ledger_payment(payment_intent, payment)

    # Create a Ledger entry for orders
    create_ledger_orders(payment_intent=payment_intent)


    # Create Expense and Ledger for shipping
    shipping_cost = create_shipping_objects(payment_intent.cart)
    # TODO Calculate all expected costs for payment intent in backend

    # Update PaymentIntent
    payment_intent.payment_reference=payment
    payment_intent.success=True
    payment_intent.save()

    # TODO: Notify the customer that payment succeeded


def handle_payment_intent_failed(id, error_message):
        print(f'Payment Intent Failed: {id} Error: {error_message}')
        payment_intent=PaymentIntent.objects.get(payment_intent_id=id)

        # No action if status has been set take for idempotency
        if payment_intent.success is not None:
            return

        # Update PaymentIntent
        payment_intent.success=False
        payment_intent.save()

        # TODO: Notify the customer that payment failed


def handle_payment_method_attached(payment_method):
    # TODO: Save payment_method in a model
    print(f'Payment method: {payment_method}')


def handle_checkout_completed(checkout_completed):
    # TODO: Save checkout_completed in a model
    print(f'Checkout completed: {checkout_completed}')


@api_view(['POST'])
def payment_webhook(request):
    # Adapted from Stripe documentation: https://stripe.com/docs/webhooks
    # TODO: Keep secret in SSM
    endpoint_secret = STRIPE_WEBHOOK_SECRET
    payload = request.body
    event = None

    try:
        event = stripe.Event.construct_from(
        json.loads(payload), stripe.api_key
        )
    except ValueError as e:
        # Invalid payload
        return Response(status=status.HTTP_400_BAD_REQUEST, data="Valid Stripe event not found")

    if endpoint_secret:
        # Only verify the event if there is an endpoint secret defined
        # Otherwise use the basic event deserialized with json
        sig_header = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook signature verification failed.' + str(e))
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE, data="Webhook signature verification failed")

    # Handle the event
    if event.type == 'payment_intent.succeeded':
        payment_intent_id = event.data.object.id # contains a stripe.PaymentIntent
        if not payment_intent_id:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Unable to find payment intent id"})
        handle_payment_intent_succeeded(payment_intent_id)

    elif event.type == "payment_intent.payment_failed":
        payment_intent_id = event.data.object.id # contains a stripe.PaymentIntent
        intent = event.data.object
        error_message = intent.last_payment_error.message if intent.last_payment_error else None
        if not payment_intent_id:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"message": "Unable to find payment intent id"})
        handle_payment_intent_failed(payment_intent_id, error_message)

    elif event.type == 'payment_method.attached':
        payment_method = event.data.object # contains a stripe.PaymentMethod
        handle_payment_method_attached(payment_method)

    elif event.type == 'checkout.session.completed':
        checkout_completed= event.data.object # contains a stripe.PaymentMethod
        handle_checkout_completed(checkout_completed)

    else:
        # ... handle other event types
        # TODO: Handle failed payment_intent
        print('Unhandled event type {}'.format(event.type))

    return Response(status=status.HTTP_200_OK)


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Modified from: django-rest-passwordreset

    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(
            instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
            reset_password_token.key)
    }
    reset_message = f"Please use this token in the reset password form: {reset_password_token.key}"
    # TODO: Remove me!
    print(f"Forgot password message {reset_message}")
    mailer("Password reset", reset_message, breadmeister_address, [context['email'], assistant_meister], log_file)


# Django HTML views

def products(request):
    categories = Category.objects.all()
    c = {
        'bread_template': 'bread/basic_template.html',
        'logo_image' : logo_image,
        'small_logo' : small_logo,
        'categories' : categories,
    }
    return render(request, "bread/products.html", c )


def about(request):
    c = {
        'bread_template': 'bread/basic_template.html',
        'logo_image' : logo_image,
        'small_logo' : small_logo,
        'roller_image': slices_image,
    }
    return render(request, "bread/new_about.html", c )


def help_user(request):
    c = {
        'bread_template': 'bread/basic_template.html',
        'logo_image' : logo_image,
        'small_logo' : small_logo,
    }

    return render(request, "bread/help.html", c )


def unsubscribe(request):
    if request.method == 'POST':
        form = UnsubscribeForm(request.POST)
        if form.is_valid():
            subscribers = Subscribers.objects.all().filter(email=form.cleaned_data['email'])
            for subscriber in subscribers:
                subscriber.is_subscriber = False
                subscriber.save()

            c = {
                'bread_template': 'bread/basic_template.html',
                'logo_image' : logo_image,
                'small_logo' : small_logo,
                'message': "Thanks, you're unsubscribed from marketing emails from Glorious Grain",
            }
            return render(request, 'bread/acknowledge.html', c)

    form = UnsubscribeForm()
    c = {
        'bread_template': 'bread/basic_template.html',
        'logo_image' : logo_image,
        'small_logo' : small_logo,
        'form': form,
        'message': 'Unsubscribe from Glorious Grain marketing emails',
    }
    return render(request, 'bread/form.html', c)


def root_index(request):
    return HttpResponseRedirect ( "./bread/")


@login_required(login_url='login')
def success(request):
    return HttpResponseRedirect ( "../bread/products.html")


# Create a new user
def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            user = authenticate(
                username=form.cleaned_data.get('username'),
                password=form.cleaned_data.get('password1')
            )
            login(request, user)
            return HttpResponseRedirect(reverse('subscribe'))
    else:
        form = UserCreationForm()
    c = {
        'bread_template': 'bread/basic_template.html',
        'logo_image' : logo_image,
        'small_logo' : small_logo,
        'form': form,
        'message': 'Choose username and password',
    }
    return render(request, 'bread/form.html', c)


@login_required(login_url='login')
def subscribe(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            # Add  first and last name and email from ContactFrom to the user object
            user = request.user
            user.first_name = form.cleaned_data['first_name']
            user.last_name = form.cleaned_data['last_name']
            user.email = form.cleaned_data['email']
            user.save()

            # Add customer to mailing list universe
            subscriber = Subscribers.objects.create(
                creation = timezone.datetime.now(),
                first_name =  form.cleaned_data['first_name'],
                last_name =  form.cleaned_data['last_name'],
                email = form.cleaned_data['email'],
                is_subscriber = form.cleaned_data['is_subscriber'],
                user_id = user
            )
            return HttpResponseRedirect(reverse('products'))
        else:
            c = {
                'bread_template': 'bread/basic_template.html',
                'logo_image' : logo_image,
                'form': form,
                'small_logo' : small_logo,
                'message': "Oops. Problems.",
            }
    else:
        user_name = request.user.username
        contact = Contacts()
        contact.user = request.user
        form = ContactForm(instance=contact)
        c = {
            'bread_template': 'bread/basic_template.html',
            'logo_image' : logo_image,
            'small_logo' : small_logo,
            'form': form,
            'message': 'Tell us more so we can confirm and deliver your order:',
        }

    return render(request, "bread/form.html", c )


@login_required(login_url='login')
def new_order(request, category):
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            order =  form.save(commit=False)
            order.user = request.user
            order.meister = False
            order.confirmed = True
            order.order_date = timezone.datetime.now()
            order.save()

            # Create entry for ledger.  Entered as negative because it's a debit.
            entry = Ledger()
            entry.user = request.user
            entry.quantity = order.product.price * order.number
            entry.credit = False
            entry.non_cash = True
            entry.cancelled = False
            entry.order_reference = order
            entry.date = order.order_date
            entry.save() 
           
            # Send confirmation email
            first, last = request.user.first_name, request.user.last_name
            name = first.lower().capitalize() + " " + last.lower().capitalize()
            product = order.product.label
            number = str(order.number)
            address = request.user.email
            date = order.delivery_date.strftime("%A, %d %B %Y")
            price = str(order.product.price*order.number)
            header = "Thanks for your gift order! " if order.this_is_a_gift else "Thanks for your order! "
            
            confirmation_message = header + name + " ordered " + number + " " + product + " for delivery on " + date + ". Reference number: " + str(order.pk) + ". Total price: $" + price
            mailer("Order confirmation", confirmation_message, breadmeister_address, [address, breadmeister_address, assistant_meister], log_file)
           
            return HttpResponseRedirect(reverse('thanks'))
        else:
            c = {
                'bread_template': 'bread/basic_template.html',
                'logo_image' : logo_image,
                'small_logo' : small_logo,
                'form': form,
                'message': "Oops. Problems.",
                'excluded': EXCLUDED_DAYS,
            }

    else:
        user_name = request.user.username
        order = Order()
        order.user = request.user
        form = OrderForm(instance=order, category=category)
        label = Category.objects.get(pk=category).label

        c = {
            'bread_template': 'bread/basic_template.html',
            'logo_image' : logo_image,
            'small_logo' : small_logo,
            'form': form,
            'message': 'Order ' + label + ':',
            'excluded': EXCLUDED_DAYS,
        }

    return render(request, "bread/order_form.html", c )


@login_required(login_url='login')
def cancel(request, order_id):
    order = get_object_or_404(Order, pk=order_id)
    if order.user != request.user:
        raise Http404("You are not the owner of that order.")
    else:
        if order.delivered is False:
            order.confirmed = False
            order.save()

            # Cancel entry in ledger
            entry = get_object_or_404(Ledger, order_reference=order)
            entry.cancelled = True
            entry.save()

            # Send cancellation email
            first, last = request.user.first_name, request.user.last_name
            name = first.lower().capitalize() + " " + last.lower().capitalize()
            address = request.user.email
            
            confirmation_message = "Order #" + str(order_id) + " by " + name + " for " + str(order.number) + " " + order.product.label + " has been cancelled."
            mailer("Order cancellation", confirmation_message, breadmeister_address, [address, breadmeister_address, assistant_meister], log_file)
           
        else:
            raise Http404("Order has been delivered.")

    return HttpResponseRedirect(reverse('products'))


@login_required(login_url='login')
def my_account(request):
    today = timezone.datetime.today().date()
    orders = Order.objects.filter(user=request.user).filter(delivery_date__gte=today).filter(confirmed=True).order_by('delivery_date')
    order_history = Order.objects.filter(user=request.user).filter(confirmed=True).filter(delivery_date__lt=today).order_by('-delivery_date')[:HISTORY]
    debits = Ledger.objects.filter(user=request.user).filter(credit=False).filter(cancelled=False).order_by('-date')[:HISTORY]
    credits = Ledger.objects.filter(user=request.user).filter(credit=True).filter(cancelled=False).order_by('-date')[:HISTORY]
    credit_slice = credits[:10]
    credit_balance = Ledger.objects.filter(user=request.user).filter(credit=True).filter(cancelled=False).aggregate(Sum('quantity')).get('quantity__sum', 0.00)
    if credit_balance is None:
        credit_balance = Decimal(0.00).quantize(Decimal('.01'))
    debit_balance = Ledger.objects.filter(user=request.user).filter(credit=False).filter(cancelled=False).aggregate(Sum('quantity')).get('quantity__sum', 0.00)
    if debit_balance is None:
        debit_balance = Decimal(0.00).quantize(Decimal('.01'))
    balance = credit_balance + debit_balance
 
    c = {
            'bread_template': 'bread/basic_template.html',
            'logo_image' : logo_image,
            'small_logo' : small_logo,
            'user_first': request.user.first_name,
            'user_last': request.user.last_name,
            'orders': orders,
            'order_history': order_history,
            'debits': debits,
            'credits': credits,
            'debit_balance': debit_balance,
            'credit_balance': credit_balance,
            'balance': balance,
            'history': HISTORY,
        }
    return render(request, "bread/my_account.html", c )


@login_required(login_url='login')
def pay(request):
    credit_balance = Ledger.objects.filter(user=request.user).filter(credit=True).filter(cancelled=False).aggregate(Sum('quantity')).get('quantity__sum', 0.00)
    if credit_balance is None:
        credit_balance = Decimal(0.00).quantize(Decimal('.01'))
    debit_balance = Ledger.objects.filter(user=request.user).filter(credit=False).filter(cancelled=False).aggregate(Sum('quantity')).get('quantity__sum', 0.00)
    if debit_balance is None:
        debit_balance = Decimal(0.00).quantize(Decimal('.01'))
    balance = credit_balance + debit_balance

    c = {
            'bread_template': 'bread/basic_template.html',
            'logo_image' : logo_image,
            'small_logo' : small_logo,
            'user_first': request.user.first_name,
            'user_last': request.user.last_name,
            'email': request.user.email,
            'balance': balance,
            'pennies': 100 * balance,
            'stripe_key': STRIPE_PUBLISHABLE,
            'card_message': card_message,
        }
    return render(request, "bread/pay.html", c )


@login_required(login_url='login')
def thanks(request):
    c = {
        'bread_template': 'bread/basic_template.html',
        'logo_image' : logo_image,
        'small_logo' : small_logo,
        'message': "Thanks for your order!",
    }

    return render (request, "bread/thanks.html", c )


@login_required(login_url='login')
def payment_thanks(request):
    c = {
        'bread_template': 'bread/basic_template.html',
        'logo_image' : logo_image,
        'small_logo' : small_logo,
        'message': "Thanks for your payment!",
    }

    return render (request, "bread/payment_thanks.html", c )


def index(request):
    return HttpResponseRedirect(reverse('products'))


@login_required(login_url='login')
def stripe_charge(request):
    credit_balance = Ledger.objects.filter(user=request.user).filter(credit=True).filter(cancelled=False).aggregate(Sum('quantity')).get('quantity__sum', 0.00)
    if credit_balance is None:
        credit_balance = Decimal(0.00).quantize(Decimal('.01'))
    debit_balance = Ledger.objects.filter(user=request.user).filter(credit=False).filter(cancelled=False).aggregate(Sum('quantity')).get('quantity__sum', 0.00)
    if debit_balance is None:
        debit_balance = Decimal(0.00).quantize(Decimal('.01'))
    balance = credit_balance + debit_balance

    if request.method == 'POST':
        token = request.POST.get("stripeToken")

    try:
        charge = stripe.Charge.create(
            amount = int(100 * balance),
            currency = "usd",
            source = token,
            description = card_message
        )

        # Charge successfully posted to Stripe.  First create a payment
        payment = Payment.objects.create(
            user = request.user,
            value = balance,
            date = timezone.datetime.now(),
            confirmed = True,
            payment_method = 'CRD'
        )
            
        # Create a Ledger entry
        entry = Ledger.objects.create(
            user = payment.user,
            quantity = -payment.value,
            credit = True,
            non_cash = False,
            cancelled = False,
            payment_reference = payment,
            date = payment.date
        ) 

        # Create a PaymentIntent
        stripe_charge = PaymentIntent.objects.create(
            payment_reference = payment,
            payment_method = 'CRD',
            payment_intent_id = charge.id
        )

    except stripe.error.CardError as ce:
        return False, ce

    else:
        # Send email confirmation
        first, last = request.user.first_name, request.user.last_name
        name = first.lower().capitalize() + " " + last.lower().capitalize()
        address = request.user.email
            
        confirmation_message = "Thanks for you payment! $" + str(balance) + " was successfully charged to the credit card of " + name
        mailer("Glorious Grain Charge", confirmation_message, breadmeister_address, [address, breadmeister_address, assistant_meister], log_file)

        # Acknowledge payment
        return HttpResponseRedirect(reverse('payment_thanks'))


@login_required(login_url='login')
def check_mail(request):
    # Send email confirmation
    first, last = request.user.first_name, request.user.last_name
    name = first.lower().capitalize() + " " + last.lower().capitalize()
    address = request.user.email
        
    confirmation_message = "We'll keep an eye out for your check. Thanks " + name + "!"
    mailer("Check's in the mail", confirmation_message, breadmeister_address, [address, breadmeister_address, assistant_meister], log_file)
        
    # Acknowledge payment
    return HttpResponseRedirect(reverse('payment_thanks'))


@login_required(login_url='login')
def subscription(request):
    if request.method == 'POST':
        form = SubscriptionForm(request.POST)
        if form.is_valid():
            subscription =  form.save(commit=False)
            subscription.user = request.user
            subscription.confirmed = True
            subscription.save()
             
            # Send email confirmation of subscription
            first, last = subscription.user.first_name, subscription.user.last_name
            name = first.lower().capitalize() + " " + last.lower().capitalize()
            address = subscription.user.email
            
            confirmation_message = "We received your subscription. We'll be in touch to handle the details. Thanks " + name + "!"
            mailer("Glorious Grain Subscription", confirmation_message, breadmeister_address, [address, breadmeister_address, assistant_meister], log_file)

            return HttpResponseRedirect(reverse('thanks'))
        else:
            c = {
                'bread_template': 'bread/manager_template.html',
                'logo_image' : logo_image,
                'form': form,
                'message': "Oops. Problems.",
            }

    else:
        form = SubscriptionForm()
        c = {
            'bread_template': 'bread/basic_template.html',
            'logo_image' : logo_image,
            'form': form,
            'message': 'Start a Subscription:',
        }

    return render(request, "bread/script_form.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def confirm(request):
    c = {
        'bread_template': 'bread/manager_template.html',
        'logo_image' : logo_image,
        'message': "Thanks for your order!",
    }

    return render(request, "bread/payment_confirmation.html", c )

# Manager views here


@user_passes_test(lambda u:u.is_staff, login_url='index')
def payment(request):
    if request.method == 'POST':
        form = PaymentForm(request.POST)
        if form.is_valid():
            payment =  form.save(commit=False)
            payment.confirmed = True
            payment.date = timezone.datetime.now()
            payment.save()
             
            # Create entry for ledger. Entered as negative because it's a credit.
            entry = Ledger()
            entry.user = payment.user
            entry.quantity = -payment.value
            entry.credit = True
            if payment.payment_method == 'CMP':
                entry.non_cash = True
            else:
                entry.non_cash = False
            entry.cancelled = False
            entry.payment_reference = payment
            entry.date = payment.date
            entry.save() 
            
            # Send email confirmation for non-comped payments
            if payment.payment_method != 'CMP':
                first, last = entry.user.first_name, entry.user.last_name
                name = first.lower().capitalize() + " " + last.lower().capitalize()
                address = entry.user.email
            
                confirmation_message = "We received your payment and credited $" + str(payment.value) + " to your account. Thanks " + name + "!"
                mailer("Glorious Grain Payment", confirmation_message, breadmeister_address, [address, breadmeister_address, assistant_meister], log_file)

            return HttpResponseRedirect(reverse('confirm'))
        else:
            c = {
                'bread_template': 'bread/manager_template.html',
                'logo_image' : logo_image,
                'form': form,
                'message': "Oops. Problems.",
            }

    else:
        form = PaymentForm()
        c = {
            'bread_template': 'bread/manager_template.html',
            'logo_image' : logo_image,
            'form': form,
            'message': 'Enter a Payment:',
        }

    return render(request, "bread/form.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def confirm(request):
    c = {
        'bread_template': 'bread/manager_template.html',
        'logo_image' : logo_image,
        'message': "Thanks for your order!",
    }

    return render(request, "bread/payment_confirmation.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def all_accounts(request):
    balance = Ledger.objects.filter(cancelled=False).filter(user__is_active=True).values('user_id', 'user__first_name', 'user__last_name').annotate(total_balance = Sum('quantity')).order_by('user__first_name')
 
    c = {
            'bread_template': 'bread/manager_template.html',
            'logo_image' : logo_image,
            'balance': balance,
    }
    return render(request, "bread/all_accounts.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def account_detail(request, user_id):
    user = User.objects.get(id=user_id)
    today = timezone.datetime.today().date()
    order_history = Order.objects.filter(user=user_id).filter(confirmed=True).filter(delivery_date__lt=today).order_by('-delivery_date')
    orders = Order.objects.filter(user=user).filter(delivery_date__gte=today).filter(confirmed=True).order_by('delivery_date')
    debits = Ledger.objects.filter(user=user_id).filter(credit=False).filter(cancelled=False).order_by('-date')
    credits = Ledger.objects.filter(user=user_id).filter(credit=True).filter(cancelled=False).order_by('-date')
    credit_balance = Ledger.objects.  \
        filter(user=user_id).         \
        filter(credit=True).          \
        filter(cancelled=False).      \
        aggregate(Sum('quantity')).   \
        get('quantity__sum', 0.00)    
    if credit_balance is None:
        credit_balance = Decimal(0.00).quantize(Decimal('.01'))
    debit_balance = Ledger.objects.   \
        filter(user=user_id).         \
        filter(credit=False).         \
        filter(cancelled=False).      \
        aggregate(Sum('quantity')).   \
        get('quantity__sum', 0.00)    
    if debit_balance is None:
        debit_balance = Decimal(0.00).quantize(Decimal('.01'))
    balance = credit_balance + debit_balance
    user_first = User.objects.get(id=user_id).first_name
    user_last = User.objects.get(id=user_id).last_name
 
    c = {
            'bread_template': 'bread/basic_template.html',
            'logo_image' : logo_image,
            'small_logo' : small_logo,
            'user_first': user_first,
            'user_last': user_last,
            'orders': orders,
            'order_history': order_history,
            'debits': debits,
            'credits': credits,
            'debit_balance': debit_balance,
            'credit_balance': credit_balance,
            'balance': balance,
    }
    return render(request, "bread/my_account.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def orders(request):
    today = timezone.datetime.today().date()
    orders_date_product = Order.objects.        \
        filter(delivery_date__gte=today).       \
        filter(confirmed=True).                 \
        select_related().                       \
        values('delivery_date', 'product__label').  \
        annotate(total=Sum('number')).          \
        order_by('delivery_date', 'product_id')          
    orders = Order.objects.filter(delivery_date__gte=today).filter(confirmed=True).order_by('delivery_date', 'user_id')
    order_history = Order.objects.filter(confirmed=True).order_by('-delivery_date', 'user_id')[:200]
 
    c = {
            'bread_template': 'bread/manager_template.html',
            'logo_image' : logo_image,
            'orders': orders,
            'order_history': order_history,
            'orders_date_product': orders_date_product,
    }
    return render(request, "bread/orders.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def order_history(request):
    today = timezone.datetime.today().date()
    orders = Order.objects.order_by('-delivery_date')
    users = User.objects.all()
    data = {
      'orders': serializers.serialize('json', orders),
      'users': serializers.serialize('json', users)
    }        
    return JsonResponse(data, safe=False)


@user_passes_test(lambda u:u.is_staff, login_url='index')
def order_meister(request):
    if request.method == 'POST':
        form = OrderMeisterForm(request.POST)
        if form.is_valid():
            order =  form.save(commit=False)
            order.confirmed = True
            order.meister = True
            order.order_date = timezone.datetime.now()
            if form.cleaned_data['recipient_name']:
                order.recipient_name = form.cleaned_data['recipient_name']
            if form.cleaned_data['recipient_address']:
                order.recipient_address = form.cleaned_data['recipient_address']
            if form.cleaned_data['recipient_city']:
                order.recipient_city = form.cleaned_data['recipient_city']
            if form.cleaned_data['recipient_state']:
                order.recipient_state = form.cleaned_data['recipient_state']
            if form.cleaned_data['recipient_message']:
                order.recipient_message = form.cleaned_data['recipient_message']
            order.save()

            # Create entry for ledger.  Entered as negative because it's a debit.
            entry = Ledger()
            entry.user = order.user
            entry.quantity = order.product.price * order.number
            entry.credit = False
            entry.non_cash = True
            entry.cancelled = False
            entry.order_reference = order
            entry.date = order.order_date
            entry.save() 
           
            # Send confirmation email
            first, last = order.user.first_name, order.user.last_name
            name = first.lower().capitalize() + " " + last.lower().capitalize()
            product = order.product.label
            number = str(order.number)
            address = order.user.email
            date = str(order.delivery_date)
            price = str(order.product.price*order.number)

            confirmation_message = "Thanks for your order! " + name + " ordered " + number + " " + product + " for delivery on " + date + ". Reference number is #" + str(order.pk) + ". Total price is $" + price
            mailer("Order confirmation", confirmation_message, breadmeister_address, [address, breadmeister_address, assistant_meister], log_file)
           
            return HttpResponseRedirect(reverse('thanks_meister'))

        else:
            c = {
                'bread_template': 'bread/basic_template.html',
                'logo_image' : logo_image,
                'small_logo' : small_logo,
                'form': form,
                'message': "Oops. Problems.",
                'excluded': MEISTER_EXCLUDED_DAYS,
            }

    else:
        user_name = request.user.username
        order = Order()
        order.user = request.user
        form = OrderMeisterForm(instance=order)
        c = {
            'bread_template': 'bread/manager_template.html',
            'logo_image' : logo_image,
            'small_logo' : small_logo,
            'form': form,
            'message': 'Enter a customer order:',
            'excluded': MEISTER_EXCLUDED_DAYS,
        }

    return render(request, "bread/meister_order_form.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def thanks_meister(request):
    c = {
        'bread_template': 'bread/manager_template.html',
        'logo_image' : logo_image,
        'small_logo' : small_logo,
        'message': "The order has been entered",
    }

    return render (request, "bread/thanks_meister.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def cancel_meister(request, order_id):
    order = get_object_or_404(Order, pk=order_id)
    if order.delivered is False:
        order.confirmed = False
        order.save()

        # Cancel entry in ledger
        entry = get_object_or_404(Ledger, order_reference=order)
        entry.cancelled = True
        entry.save()

        # Send cancellation email
        first, last = order.user.first_name, order.user.last_name
        name = first.lower().capitalize() + " " + last.lower().capitalize()
        address = order.user.email
            
        confirmation_message = "Order #" + order_id + " for " + name + " has been cancelled."
        mailer("Order cancellation", confirmation_message, breadmeister_address, [address, breadmeister_address, assistant_meister], log_file)
           
    else:
        raise Http404("Order has been delivered.")

    return HttpResponseRedirect(reverse('orders'))


@user_passes_test(lambda u:u.is_staff, login_url='index')
def contacts(request):
    c = {
        'bread_template': 'bread/manager_template.html',
        'logo_image' : logo_image,
    }

    return render(request, "bread/contacts.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def customers(request):
    customers = Contacts.objects.filter(user__is_active=True).order_by('first_name')
    c = {
        'bread_template': 'bread/manager_template.html',
        'logo_image' : logo_image,
        'message': 'Customer List:',
        'customers': customers,
    }

    return render(request, "bread/customers.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def mail_list(request):
    if request.method == 'POST':
        form = MailListForm(request.POST)
        if form.is_valid():
            form.save()
            c = {
                'bread_template': 'bread/manager_template.html',
                'logo_image' : logo_image,
            }
            return render(request, "bread/contacts.html", c )
        else:
            c = {
                'bread_template': 'bread/manager_template.html',
                'logo_image' : logo_image,
                'form': form,
                'message': "Oops. Problems.",
            }

    else:
        form = MailListForm()
        c = {
            'bread_template': 'bread/manager_template.html',
            'logo_image' : logo_image,
            'message': 'Create a Mail List:',
            'form': form,
       }

    return render(request, "bread/form.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def mail_list_view(request):
    lists = MailList.objects.all()
    c = {
        'bread_template': 'bread/manager_template.html',
        'logo_image' : logo_image,
        'message': 'Mail Lists:',
        'lists': lists,
    }

    return render(request, "bread/mail_lists.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def mail_list_edit(request, list_id):
    model = MailList.objects.get(pk=list_id)
    if request.method == 'POST':
        form = MailListForm(request.POST, instance=model)
        if form.is_valid():
            form.save()
            c = {
                'bread_template': 'bread/manager_template.html',
                'logo_image' : logo_image,
            }
            return render(request, "bread/contacts.html", c )
        else:
            c = {
                'bread_template': 'bread/manager_template.html',
                'logo_image' : logo_image,
                'form': form,
                'message': "Oops. Problems.",
            }

    else:
        # model = MailList.objects.get(pk=list_id)
        form = MailListForm(instance=model)
        c = {
            'bread_template': 'bread/manager_template.html',
            'logo_image' : logo_image,
            'message': 'Edit a Mail List:',
            'form': form,
       }

    return render(request, "bread/form.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def campaign(request):
    import smtplib, time
    import email.mime.text
    import email.utils
    import datetime

    signature = SIGNATURE or ""
    footer = EMAIL_FOOTER or ""
    html_footer = HTML_FOOTER or ""

    # Open output file
    log_file = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', 'log/message.log'))

    time_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(log_file, 'a') as f:
        print ("Campaign launch at: " + time_str, file=f)

    if request.method == 'POST':
        form = CampaignForm(request.POST)
        if form.is_valid():
            campaign_ = form.save()
            c = {
                'bread_template': 'bread/manager_template.html',
                'logo_image' : logo_image,
                'key': campaign_.pk,
                'form': form,
                'message': "Success! Warning: Do not resubmit to the same mail list!"
            }

            # Fetch recipients on mailing list
            start = form['start_index']
            # Working on this part
            recipients = campaign_.mail_list.recipients.all().order_by('index_key')

            # Make a list of email recipients from objects
            recipient_list = [recipient.first_name + " " + recipient.last_name + " <" + recipient.email + ">" for recipient in recipients]

            # Connect to server
            try:
                server=smtplib.SMTP(EMAIL_SERVER, EMAIL_PORT, timeout=300)
                # Insert this for AWS
                server.starttls()
                write_log_message("connect_success", "0", log_file, EMAIL_SERVER, str(EMAIL_PORT)) 
            except (smtplib.socket.gaierror, smtplib.socket.error, smtplib.socket.herror):
                c['message'] = "Failed to connect to email server"
                write_log_message("connect_failure", "0", log_file, EMAIL_SERVER, str(EMAIL_PORT))
                return render(request, "bread/form.html", c )

            # Log in to connected server
            try:
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                write_log_message("login_success", "0", log_file, EMAIL_USER,  datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

            except smtplib.SMTPAuthenticationError:
                c['message'] = "Failed to login to email server"
                write_log_message("login_failure", "0", log_file, EMAIL_USER,  datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                return render(request, "bread/form.html", c )

            # Fire emails to the mailing list with the appropriate subject and message
            subject = campaign_.subject
            send_address = sender_address
            text_message = campaign_.message

            for counter, recipient in enumerate(recipient_list):
                # Make the msg object
                msg = make_msg(send_address, recipient, subject, text_message, signature, footer, html_footer)

                # Send it
                try:
                    server.sendmail(EMAIL_SENDER, recipient, msg.as_string())
                    write_log_message("success", "0", log_file, recipient, subject)

                except smtplib.SMTPServerDisconnected:
                    c['message'] = "Server disconnect at count: " + str(counter) + "  Address: " + recipient
                    write_log_message("disconnect_failure", "0", log_file, recipient, subject)
                    return render(request, "bread/form.html", c )
                except Exception:
                    c['message'] = "Rejected value at count: " + str(counter) + "  Address: " + recipient
                    write_log_message("failure", "0", log_file, recipient, subject)
                    return render(request, "bread/form.html", c )

            # Close connection to mail server
            try:
                server.quit()
                write_log_message("quit_success", "0", log_file, EMAIL_SERVER,  datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))


            except(Exception):
                c = {'message': "Server failed while sending to user " + msg["To"]}
                write_log_message("quit_failure", "0", log_file, EMAIL_SERVER,  datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                return render(request, "bread/form.html", c )

        else:
            c = {'message': "Oops. Problems."}

        return render(request, "bread/form.html", c )

    else:
        form = CampaignForm()
    c = {
        'bread_template': 'bread/manager_template.html',
        'logo_image' : logo_image,
        'message': 'Send Message to a Mail List:',
        'form': form,
    }

    return render(request, "bread/form.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def deliveries(request):
    today = timezone.datetime.today().date()
    orders = Order.objects.            \
        filter(delivery_date=today).   \
        filter(confirmed=True).        \
        filter(this_is_a_gift=False).  \
        select_related('user').        \
        order_by('user__first_name')

    gift_orders = Order.objects.       \
        filter(delivery_date=today).   \
        filter(confirmed=True).        \
        filter(this_is_a_gift=True).   \
        select_related('user').        \
        order_by('user__first_name')
 
    c = {
            'bread_template': 'bread/manager_template.html',
            'logo_image' : logo_image,
            'small_logo' : small_logo,
            'orders': orders,
            'gift_orders': gift_orders,
            'delivery_date': today
    }
    return render(request, "bread/deliveries.html", c )


@user_passes_test(lambda u:u.is_staff, login_url='index')
def delivered(request, order_id):
    order = get_object_or_404(Order, pk=order_id)
    if order.delivered is False:
        order.delivered = True
        order.save()

        # Send delivery email
        first, last = order.user.first_name, order.user.last_name

        name = first.lower().capitalize() + " " + last.lower().capitalize()
            
        # Send to me instead of customers for debugging???

        # Send email out to customer
        address = order.user.email
            
        # Text of message depends on if it's a gift
        if order.this_is_a_gift:
            confirmation_message = "Glorious Grain order #" + str(order_id) + " from " + name + " has been delivered. Thanks for giving the gift of bread!"
        else: 
            confirmation_message = "Glorious Grain order #" + str(order_id) + " for " + name + " has been delivered. We hope you enjoy it!"

        mailer("Order delivery", confirmation_message, breadmeister_address, [address, breadmeister_address, assistant_meister], log_file)
           
    return HttpResponseRedirect(reverse('deliveries'))


@user_passes_test(lambda u:u.is_staff, login_url='index')
def material(request):
    if request.method == 'POST':
        form = MaterialsForm(request.POST)
        if form.is_valid():
            form.save()

            return HttpResponseRedirect(reverse('orders'))

        else:
            c = {'message': "Oops. Problems."}

        return render(request, "bread/form.html", c )
    else:
        form = MaterialsForm()
    c = {
        'bread_template': 'bread/manager_template.html',
        'logo_image' : logo_image,
        'message': 'Enter a material variety for purchase and inventory:',
        'units': UNITS,
        'form': form,
    }

    return render(request, "bread/form.html", c )

