from django.urls import path, re_path, include
from django.views.generic.edit import CreateView
from django.contrib import admin
from django.contrib.auth.forms import UserCreationForm
import bread.views as bread_views

admin.autodiscover()

#urlpatterns = patterns('',
urlpatterns = [
    path('', bread_views.index, name='index'),
    path('index', bread_views.index, name='index'),

    #Register a new user
    path('register/', bread_views.register, name='register'),

    #Login, logout, reset, etc.
    path('', include('django.contrib.auth.urls')),

    #Subscribe to mail list
    path('subscribe', bread_views.subscribe, name='subscribe'),

    #Unsubscribe to mail list
    path('unsubscribe', bread_views.unsubscribe, name='unsubscribe'),

    #Subscription for bread delivery
    path('subscription', bread_views.subscription, name='subscription'),

    #New order
    path('new_order/<int:category>/', bread_views.new_order, name='new_order'),

    #Thanks for the order
    path('thanks', bread_views.thanks, name='thanks'),

    #Thanks for the meister order
    path('thanks_meister', bread_views.thanks_meister, name='thanks_meister'),

    #Thanks for the payment
    path('payment_thanks', bread_views.payment_thanks, name='payment_thanks'),

    #Check in the mail
    path('check_mail', bread_views.check_mail, name='check_mail'),

    #Cancel
    path('cancel/<int:order_id>/', bread_views.cancel, name='cancel'),

    #My account
    path('my_account', bread_views.my_account, name='my_account'),

    #Pay balance
    path('pay', bread_views.pay, name='pay'),

    #Stripe charge
    path('stripe_charge', bread_views.stripe_charge, name='stripe_charge'),

    #About
    path('about', bread_views.about, name='about'),

    #Help
    path('help', bread_views.help, name='help'),

    #Success
    path('success', bread_views.success, name='success'),

    #Payment manager view
    path('payment', bread_views.payment, name='payment'),

    #Expense manager view
    #url(r'^expense$', bread_views.expense, name='expense'),

    #Confirm
    path('confirm', bread_views.confirm, name='confirm'),

    #Products
    path('products', bread_views.products, name='products'),

    #Accounts manager view
    path('all_accounts', bread_views.all_accounts, name='all_accounts'),

    #Account detail manager view
    path('account_detail/<int:user_id>/', bread_views.account_detail, name='account_detail'),

    #Orders manager view
    path('orders', bread_views.orders, name='orders'),

    #Order meister entry view
    path('order_meister', bread_views.order_meister, name='order_meister'),

    #Cancel meister view
    re_path(r'^account_detail/[0-9]+/cancel/(?P<order_id>[0-9]{1,11})/$', bread_views.cancel_meister, name='cancel_meister'),

    #Contacts manager view
    path('contacts', bread_views.contacts, name='contacts'),

    #Customer List manager view
    path('customers', bread_views.customers, name='customers'),

    #MailList manager view
    path('mail_list', bread_views.mail_list, name='mail_list'),

    #MailList view manager view
    path('mail_list_view', bread_views.mail_list_view, name='mail_list_view'),

    #MailList edit manager view
    path('mail_list_edit/<int:list_id>', bread_views.mail_list_edit, name='mail_list_edit'),

    #Campaign manager view
    path('campaign', bread_views.campaign, name='campaign'),

    #Delivery manager view
    path('deliveries', bread_views.deliveries, name='deliveries'),

    #Delivered
    re_path('delivered/<int:order_id>/', bread_views.delivered, name='delivered'),

    #Material manager view
    path('material', bread_views.material, name='material'),

    #Expense manager view
    #url(r'^expense$', bread_views.expense, name='expense'),

]
