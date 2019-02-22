import datetime
from re import sub
from decimal import Decimal
from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Contacts, Order, Products, Payment, Materials, MaterialCategory, Campaign, MailList, Subscribers, Subscription
from .models import STATE_CHOICES, PAYMENT_CHOICES, SUBSCRIPTION_CHOICES, EXCLUDED_DAYS, MEASURE_CHOICES, CAT_CHOICES

#Helper function to find the next allowed delivery date, given the excluded days of the week in EXCLUDED_DAYS
def next_day():
    dow = timezone.datetime.today().weekday()
    #datetimepicker uses days of the week with Sunday = 0, but django uses Monday = 0.  Use picker so EXCLUDED_DAYS works.
    #Increment by 2 to adjust the day of week convention and because it starts tomorrow
    picker_dow = (dow + 2) % 7
    #Start with tomorrow as candidate, and then go days until the candidate isn't excluded 
    days = 1
    while picker_dow in EXCLUDED_DAYS:
        days = days + 1
        picker_dow = (picker_dow + 1) % 7
    return days 

def exclusion_test(day):
    '''Converts to date picker [0, 6] convention Sun-Sat to [0, 6] convention Mon-Sun in ORM'''
    return (day + 1) % 7 in EXCLUDED_DAYS

#Model Forms

#Customized Model Choice Field
class UserChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return "%s %s" % (obj.first_name, obj.last_name)

class ContactForm(forms.ModelForm):

    #This statement controls whether the validation forces the field to be populated.  stackoverflow.com/questions/16205908/django-modelform-not-required-field

    first_name=forms.RegexField(regex=r'^[a-zA-Z\.\-\' ]+$')    
    last_name=forms.RegexField(regex=r'^[a-zA-Z\.\-\' ]+$')    
    address=forms.RegexField(regex=r'^[0-9a-zA-Z\.\-\' ]+$')    
    city=forms.RegexField(regex=r'^[a-zA-Z\.\-\' ]+$')    
    state=forms.CharField(required=True, max_length=2, widget=forms.Select(choices=STATE_CHOICES))
    zip=forms.RegexField(regex=r'^\d{5}$')    
    mobile=forms.RegexField(regex=r'^\s*1?[- (]*[0-9]{3}[- )]*[0-9]{3}[- ]*[0-9]{4}\s*$')
    is_subscriber = forms.BooleanField(label="Do you want to receive our witty marketing emails?", initial=True, required=False)

    def clean_mobile(self):
        number = self.cleaned_data['mobile']
        number_str = sub('[^0-9]', '', number.strip().lstrip("1"))
        if len(number_str) == 10:
          return int(number_str)
        else:
          raise forms.ValidationError("Please enter a mobile number in the form 8005551212")
          return number

    class Meta:
        model = Contacts
        fields = [
            'user',
                'first_name',
                'last_name',
                'address',
                'city',
                'state',
                'zip',
                'email',
                'mobile',
            'is_subscriber',
        ]


class OrderForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        if 'category' in kwargs:
            cat = kwargs.pop('category')
        else:
            cat =''
        super(OrderForm, self).__init__(*args, **kwargs)
        if cat != '':
            self.fields['product'] = forms.ModelChoiceField(queryset=Products.objects.all().filter(category=cat), widget=forms.RadioSelect, initial=1)
        else:
            self.fields['product'] = forms.ModelChoiceField(queryset=Products.objects.all(), widget=forms.Select, initial=0)


    #This statement controls whether the validation forces the field to be populated.  stackoverflow.com/questions/16205908/django-modelform-not-required-field
    #Bootstrap DateTimePicker pypi.python.org/pypi/django-bootstrap3-datetimepicker

    #stackoverflow.com/questions/28148125/how-to-use-the-bootstrap-datepicker-in-django
    DATEPICKER = {
        'type':  'text',
        'class':  'form-control',
        'id': 'datetimepicker4'
    } 

    #cf: stackoverflow.com/questions/20427701/django-radioselect-choice-from-model and stackoverflow.com/1336900/django-modelchoicefield-and-initial-value
    number=forms.IntegerField(min_value=1, max_value=10, initial=1) 
    delivery_date = forms.DateField(widget=forms.DateInput(attrs=DATEPICKER))
    meister = forms.HiddenInput()
    recipient_name = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_address = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_city = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_state = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_message = forms.CharField(widget=forms.HiddenInput(), required=False)
   
    class Meta:
        model = Order
        fields = [
                'product',
                'number',
                'delivery_date',
            'this_is_a_gift',
            'recipient_name',
            'recipient_address',
            'recipient_city',
            'recipient_state',
            'recipient_message',
        ]

    def clean(self, *args, **kwargs):
        super(OrderForm, self).clean(*args, **kwargs)
        if self.cleaned_data['delivery_date'] < (timezone.datetime.today() + timezone.timedelta(days=next_day())).date():
            raise ValidationError('Sorry, we cannot deliver bread on that day')
        if exclusion_test(self.cleaned_data['delivery_date'].weekday()):
            raise ValidationError("Sorry, we're closed. Email if it's a bread emergency")

class OrderMeisterForm(forms.ModelForm):

    #This statement controls whether the validation forces the field to be populated.  stackoverflow.com/questions/16205908/django-modelform-not-required-field
    #Bootstrap DateTimePicker pypi.python.org/pypi/django-bootstrap3-datetimepicker

    #stackoverflow.com/questions/28148125/how-to-use-the-bootstrap-datepicker-in-django
    DATEPICKER = {
        'type':  'text',
        'class':  'form-control',
        'id': 'datetimepicker4'
    } 

    #cf: stackoverflow.com/questions/20427701/django-radioselect-choice-from-model and stackoverflow.com/1336900/django-modelchoicefield-and-initial-value
    user = UserChoiceField(queryset=User.objects.exclude(is_active=0).order_by('first_name'), widget=forms.Select, initial=0)
    product=forms.ModelChoiceField(queryset=Products.objects.all(), widget=forms.Select, initial=0)
    number=forms.IntegerField(min_value=1, max_value=100, initial=1) 
    #date=forms.DateField(widget=DateTimePicker(options={"format": "YYY-MM-DD", "pickTime": False}))   
    delivery_date = forms.DateField(widget=forms.DateInput(attrs=DATEPICKER))
    special_instructions = forms.CharField(required=False)
    recipient_name = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_address = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_city = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_state = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_message = forms.CharField(widget=forms.HiddenInput(), required=False)
   
    class Meta:
        model = Order
        fields = [
            'user',
                'product',
                'number',
                'delivery_date',
            'special_instructions',
            'this_is_a_gift'
        ]

class PaymentForm(forms.ModelForm):
    user = UserChoiceField(queryset=User.objects.exclude(is_active=0).order_by('first_name'), widget=forms.Select, initial=0)
    value = forms.DecimalField(max_digits=8, decimal_places=2, initial=Decimal('0.00'))
    payment_method = forms.CharField(required=True, max_length=3, widget=forms.Select(choices=PAYMENT_CHOICES))
     
    class Meta:
        model = Payment
        fields = [
            'user',
                'value',
                'payment_method',
        ]

#Customized Model Choice Fields
class MyModelMultipleChoiceField(forms.ModelMultipleChoiceField):
    def label_from_instance(self, obj):
        return "%s %s" % (obj.first_name, obj.last_name)

class MailListForm(forms.ModelForm):
    recipients = MyModelMultipleChoiceField(queryset=Subscribers.objects.exclude(is_subscriber=0).order_by('first_name'), widget=forms.CheckboxSelectMultiple(),required=True)

    class Meta:
        model = MailList
        fields = [
            'label',
            'recipients',
        ]

#Customized Model Choice Field
class MyModelChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return "%s" % (obj.label, )

class CampaignForm(forms.ModelForm):
    #mail_list=MyModelChoiceField(queryset=MailList.objects.all(), widget=forms.Select, initial=0)
    mail_list=MyModelChoiceField(queryset=MailList.objects.all(), widget=forms.Select, initial={'message': 'Initial message!'})

    class Meta:
        model = Campaign
        fields = [
            'date',
            'mail_list',
            'subject',
            'message',
        ]
    date = forms.DateField(initial=datetime.date.today) 
    subject = forms.CharField(max_length=200)
    start_index = forms.IntegerField(initial=0)

class SubscriptionForm(forms.ModelForm):

    challah_freq=forms.CharField(required=True, max_length=6, label="How often do you want Challah?", widget=forms.RadioSelect(choices=SUBSCRIPTION_CHOICES))
    sour_freq=forms.CharField(required=True, max_length=6, label="How often do you want Crusty Bread?", widget=forms.RadioSelect(choices=SUBSCRIPTION_CHOICES))
    corn_freq=forms.CharField(required=True, max_length=6, label="How often do you want Cornbread?", widget=forms.RadioSelect(choices=SUBSCRIPTION_CHOICES))
    challah_number=forms.IntegerField(min_value=0, max_value=10, initial=1, label="How many?") 
    sour_number=forms.IntegerField(min_value=0, max_value=10, initial=1, label="How many?") 
    corn_number=forms.IntegerField(min_value=0, max_value=10, initial=1, label="How many?") 

    recipient_name = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_address = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_city = forms.CharField(widget=forms.HiddenInput(), required=False)
    recipient_state = forms.CharField(widget=forms.HiddenInput(), required=False)
    class Meta:
        fields = [
            'challah_freq',
            'challah_number', 
            'sour_freq',  
            'sour_number', 
            'corn_freq',
            'corn_number',
            'special_instructions',
            'this_is_a_gift',
            'recipient_name',
            'recipient_address',
            'recipient_city',
            'recipient_state',
        ]

        labels = {
            'special_instructions': "Special instructions about your subscription",
            'this_is_a_gift': "Is this subscription a gift?",
        }

        model = Subscription

class UnsubscribeForm(forms.ModelForm):

    class Meta:
        model = Subscribers
        fields = [
            'email'
        ]

class MaterialsForm(forms.ModelForm):
    category=MyModelChoiceField(queryset=MaterialCategory.objects.all(), widget=forms.Select)
    measure=forms.CharField(required=True, max_length=6, widget=forms.RadioSelect(choices=MEASURE_CHOICES))
    units = forms.CharField(widget=forms.HiddenInput(), required=False)

    class Meta:
        model = Materials
        fields = [
            'category',
            'product',
            'label',
            'quantity',
            'measure',
            'units',
        ]
