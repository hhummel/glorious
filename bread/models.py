from django.utils import timezone
from django.core.exceptions import ValidationError
from django.conf import settings
from django.db import models


# Create your models here.
from django.db import models
from django.forms import ModelForm

#Choices
PREFIX_CHOICES = (
    ('Mr.', 'Mr.'),
    ('Mrs.', 'Mrs'),
    ('Ms.', 'Ms'),
    ('Dr.', 'Dr'),
    ('Prof.', 'Prof'),
)

SUFFIX_CHOICES = (
    ('', 'None'),
    (', PhD', 'PhD'),
    (', MD', 'MD'),
    (', DO', 'DO'),
    (', DDM', 'DDM'),
    (', Esq.', 'Esq'),
    (', Jr.', 'Jr'),
    (', Sr.', 'Sr'),
    (', II', 'II'),
    (', III', 'III'),
    (', IV', 'IV'),
    (', V', 'V'),
)

STATE_CHOICES = (
    ('PA', 'Pennsylvania'),
    ('AL', 'Alabama'),
    ('AK', 'Alaska'),
    ('AR', 'Arkansas'),
    ('CA', 'California'),
    ('CO', 'Colorado'),
    ('CT', 'Connecticut'),
    ('DC', 'District of Columbia'),
    ('DE', 'Delaware'),
    ('FL', 'Florida'),
    ('GA', 'Georgia'),
    ('HI', 'Hawaii'),
    ('ID', 'Idaho'),
    ('IL', 'Illinois'),
    ('IN', 'Indiana'),
    ('IA', 'Iowa'),
    ('KS', 'Kansas'),
    ('KY', 'Kentucky'),
    ('LA', 'Louisiana'),
    ('ME', 'Maine'),
    ('MD', 'Maryland'),
    ('MA', 'Massachusetts'),
    ('MI', 'Michigan'),
    ('MN', 'Minnesota'),
    ('MS', 'Mississippi'),
    ('MO', 'Missouri'),
    ('MT', 'Montana'),
    ('NE', 'Nebraska'),
    ('NV', 'Nevada'),
    ('NH', 'New Hampshire'),
    ('NJ', 'New Jersey'),
    ('NM', 'New Mexico'),
    ('NY', 'New York'),
    ('NC', 'North Carolina'),
    ('ND', 'North Dakota'),
    ('OH', 'Ohio'),
    ('OK', 'Oklahoma'),
    ('OR', 'Oregon'),
    ('RI', 'Rhode Island'),
    ('SC', 'South Dakota'),
    ('TN', 'Tennessee'),
    ('TX', 'Texas'),
    ('UT', 'Utah'),
    ('VT', 'Vermont'),
    ('VA', 'Virginia'),
    ('WA', 'Washington'),
    ('WV', 'West Virginia'),
    ('WI', 'Wisconsin'),
    ('WY', 'Wyoming'),
)

DAY_CHOICES = (
    ('Mon', 'Monday'),
    ('Tue', 'Tuesday'),
    ('Wed', 'Wednesday'),
    ('Thu', 'Thursday'),
    ('Fri', 'Friday'),
    ('Sat', 'Saturday'),
    ('Sun', 'Sunday'),
)

CARRIER_CHOICES = (
    ('VER', 'Verizon Wireless'),
    ('ATT', 'AT&T Mobility'),
    ('SPR', 'Sprint Corporation'),
    ('TMO', 'T-Mobile US'),
    ('USC', 'US Cellular'),
    ('VRG', 'Virgin Mobile'),
)


MUNICIPAL_CHOICES = (
    ('PHILADELPHIA', 'Philadelphia, PA'),
    ('LOWER_MERION', 'Lower Merion Township, PA'),
    ('NARBERTH', 'Narberth, PA'),
    ('RADNOR', ', Radnor Township, PA'),
    ('HAVERFORD', ', Haverford Township, PA'),
    ('WILLISTOWN', 'Willistown Township, PA'),
    ('EASTTOWN', ', Easttown Township, PA'),
    ('MALVERN', ', Malvern, PA'),
    ('PITTSBURGH', ', Pittsburgh, PA'),
    ('TREDYFFRIN', 'Tredyffrin Township, PA'),
    ('NEW_YORK', 'New York, NY'),
    ('LOS_ANGELES', 'Los Angeles, CA'),
    ('CHICAGO', 'Chicago, IL'),
    ('HOUSTON', 'Houston, TX'),
    ('PHOENIX', 'Phoenix, AZ'),
    ('SAN_ANTONIO', 'San Antonio, TX'),
    ('SAN_DIEGO', 'San Diego, CA'),
    ('DALLAS', 'Dallas, TX'),
    ('SAN_JOSE', 'San Jose, CA'),
    ('AUSTIN', 'Austin, TX'),
    ('INDIANAPOLIS', 'Indianapolis, IN'),
    ('JACKSONVILLE', 'Jacksonville, FL'),
    ('SAN_FRANCISCO', 'San Francisco, CA'),
    ('COLUMBUS', 'Columbus, OH'),
    ('CHARLOTTE', 'Charlotte, NC'),
    ('FORT_WORTH', 'Fort Worth, TX'),
    ('DETROIT', 'Detroit, MI'),
    ('EL_PASO', 'El Paso, TX'),
    ('MEMPHIS', 'Memphis, TN'),
    ('SEATTLE', 'Seattle, WA'),
    ('DENVER', 'Denver, CO'),
    ('DC', 'Washington, DC'),
    ('BOSTON', 'Boston, MA'),
    ('NASHVILLE', 'Nashville, TN'),
    ('BALTIMORE', 'Baltimore, MD'),
    ('NEWTON', 'Newton, MA'),
    ('BROOKLINE', 'Brooline, MA'),
    ('CAMBRIDGE', 'Cambridge, MA'),
    ('NAPERVILLE', 'Naperville, IL'),
    ('WHITE_PLAINS', 'White Plains, NY'),
    ('NEW_HAVEN', 'New Haven, CT'),
    ('STAMFORD', 'Stamford, CT'),
    ('PRINCETON', 'Princeton, NJ'),
)

CURRENT_CHOICES = (
    ('LOWER_MERION', 'Lower Merion Township, PA'),
)

PAYMENT_CHOICES = (
    ('CSH', 'Cash'),
    ('CHK', 'Check'),
    ('VEN', 'Venmo'),
    ('CRD', 'Card'),
    ('CMP', 'Comped'),
)

SUBSCRIPTION_CHOICES = (
    ('WEEK', 'Weekly'),
    ('2_WKS', 'Every other week'),
    ('OTHER', 'Other'),
    ('NONE', 'Not now, thanks')
)

MEASURE_CHOICES = (
    ('WT', 'weight'),
    ('VOL', 'volume'),
    ('CT', 'count'),
    ('LEN', 'length'),
)

UNITS = {
    "WT": {
        'GR': 'grams',
        'KG': 'kilograms',
        'OZ': 'ounces',
        'LB': 'pounds'
    },

    "VOL": {
        'LT': 'liters',
        'FL_OZ': 'fluid_ounces',
        'GAL': 'gallons'
    },

    "CT": {
        'CT': 'count',
        'DZ': 'dozen'
    },

    "LEN": {
        'FT': 'feet',
        'YD': 'yards',
        'M': 'meters'
    },
}

CAT_CHOICES = (
    ('DRY', 'Dry ingredients'),
    ('OIL', 'Honey, syrups, chocolate and oils'),
    ('DAIRY', 'Eggs and dairy'),
    ('SEASON', 'Seasoning and spices'),
    ('FRUITS', 'Fruits, nuts and seeds'),
    ('PACK', 'Packaging'),
)
# Days of the week when bread is not available, Sunday = 0 to be consistent with datetimepicker. Using array so js interprets it as an array.
EXCLUDED_DAYS = [0, 1, 3, 4, 6]
MEISTER_EXCLUDED_DAYS = []
    
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

#Contact information.  Note create is the creation time of the contact object in UTC
class Contacts(models.Model):
    creation = models.DateTimeField(auto_now_add=True, blank=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(max_length=35)
    middle_name = models.CharField(max_length=35, null=True)
    last_name = models.CharField(max_length=35)
    creation = models.DateTimeField(auto_now_add=True, blank=True)
    first_name = models.CharField(max_length=35)
    middle_name = models.CharField(max_length=35, null=True)
    last_name = models.CharField(max_length=35)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2, choices=STATE_CHOICES, default='PA')
    zip = models.CharField(max_length=5)
    municipality = models.CharField(max_length=25, choices=MUNICIPAL_CHOICES)
    email = models.EmailField(max_length=100)
    mobile = models.CharField(max_length=10, null=True)
    carrier = models.CharField(max_length=3, choices=CARRIER_CHOICES)
    active = models.BooleanField(default=False)

    def __str__(self):
        return_string =  self.first_name + " " + self.last_name
        return return_string

#Product categories
class Category(models.Model):
    index_key = models.AutoField(primary_key=True)
    category = models.CharField(max_length=17)
    label = models.CharField(max_length=100, null=False)
    blurb = models.CharField(max_length=500, null=True)
    picture = models.CharField(max_length=500, null=True)
    font_color = models.CharField(max_length=15, null=True)

#Products
class Products(models.Model):
    index_key = models.AutoField(primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    product = models.CharField(max_length=17)
    label = models.CharField(max_length=100, null=False)
    price = models.IntegerField(null=False)
    picture = models.CharField(max_length=500, null=True)

    def __str__(self):
        return_string =  self.label + "  $" + str(self.price)
        return return_string

#Material categories
class MaterialCategory(models.Model):
    index_key = models.AutoField(primary_key=True)
    category = models.CharField(max_length=17)
    label = models.CharField(max_length=100, null=False)
    super_cat = models.CharField(max_length=6, choices=CAT_CHOICES, default='DRY', null=False)
    display_order = models.IntegerField(null=True)
    picture = models.CharField(max_length=500, null=True)

#Materials
class Materials(models.Model):
    index_key = models.AutoField(primary_key=True)
    category = models.ForeignKey(MaterialCategory, on_delete=models.CASCADE, default=1)
    product = models.CharField(max_length=17)
    label = models.CharField(max_length=100, null=False)
    quantity = models.FloatField(null=False)
    measure = models.CharField(max_length=6, choices=MEASURE_CHOICES, null=False)
    units = models.CharField(max_length=6, null=True)
    picture = models.CharField(max_length=500, null=True)

    def __str__(self):
        return_string = self.label + " " + self.quantity + " "
        if measure == "WT":
            return return_string + self.weight_units
        if measure == "VOL":
            return return_string + self.volume_units
        if measure == "CT":
            return return_string + self.count_units
        if measure == "LEN":
            return return_string + self.length_units

#Order information.
class Order(models.Model):
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    number = models.IntegerField(null=False, default=1)
    delivery_date = models.DateField(null=False, default=(timezone.datetime.today() + timezone.timedelta(days=next_day())).date())
    order_date = models.DateTimeField(null=False)
    standing = models.BooleanField(default=False)
    confirmed = models.BooleanField(default=False)
    delivered = models.BooleanField(default=False)
    special_instructions = models.TextField(max_length=150, null=True, blank=True) 
    this_is_a_gift = models.BooleanField(default=False)
    meister = models.BooleanField(default=False)
    recipient_name = models.CharField(max_length=100, null=True, blank=True) 
    recipient_address = models.CharField(max_length=100, null=True, blank=True) 
    recipient_city = models.CharField(max_length=100, null=True, blank=True) 
    recipient_state = models.CharField(max_length=100, null=True, blank=True) 
    recipient_message = models.TextField(max_length=150, null=True, blank=True) 

#Expense information.
class Expense(models.Model):
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    material = models.ForeignKey(Materials, on_delete=models.CASCADE)
    number = models.IntegerField(null=False, default=1)
    price = models.FloatField(null=False)
    payment_method = models.CharField(max_length=3, choices=PAYMENT_CHOICES)
    expense_date = models.DateTimeField(null=False)
    confirmed = models.BooleanField(default=False)
    special_instructions = models.TextField(max_length=150, null=True, blank=True) 

#Subsription information.
class Subscription(models.Model):
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    challah_freq = models.CharField(max_length=6, choices=SUBSCRIPTION_CHOICES, default='WKLY')
    challah_number = models.IntegerField(null=False, default=1)
    sour_freq = models.CharField(max_length=6, choices=SUBSCRIPTION_CHOICES, default='WKLY')
    sour_number = models.IntegerField(null=False, default=1)
    corn_freq = models.CharField(max_length=6, choices=SUBSCRIPTION_CHOICES, default='WKLY')
    corn_number = models.IntegerField(null=False, default=1)
    confirmed = models.BooleanField(default=False)
    special_instructions = models.TextField(max_length=500, null=True, blank=True) 
    this_is_a_gift = models.BooleanField(default=False)
    recipient_name = models.CharField(max_length=100, null=True, blank=True)
    recipient_address = models.CharField(max_length=100, null=True, blank=True)
    recipient_city = models.CharField(max_length=100, null=True, blank=True)
    recipient_state = models.CharField(max_length=2, choices=STATE_CHOICES, default='PA', null=True)

#Gift recipient details
class Gift(models.Model):
    index_key = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=35)
    middle_name = models.CharField(max_length=35, null=True)
    last_name = models.CharField(max_length=35)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2, choices=STATE_CHOICES, default='PA')
    zip = models.CharField(max_length=5)
    municipality = models.CharField(max_length=25, choices=MUNICIPAL_CHOICES)
    message = models.TextField(max_length=500) 

#Payment information.
class Payment(models.Model):
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=6, decimal_places=2, null=False)
    date = models.DateField(null=False)
    payment_method = models.CharField(max_length=3, choices=PAYMENT_CHOICES)
    confirmed = models.BooleanField(default=False)

#Stripe charge
class StripeCharge(models.Model):
    index_key = models.AutoField(primary_key=True)
    payment_reference = models.ForeignKey(Payment, on_delete=models.CASCADE, null=True)
    charge_id = models.CharField(max_length=234)

#Credit or debit
class Ledger(models.Model):
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=6, decimal_places=2, null=False)
    credit = models.BooleanField(default=True)
    non_cash = models.BooleanField(default=True)
    cancelled = models.BooleanField(default=True)
    order_reference = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    payment_reference = models.ForeignKey(Payment, on_delete=models.CASCADE, null=True)
    expense_reference = models.ForeignKey(Expense, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField(null=False)

#Mailing list subscribers
class Subscribers(models.Model):
    index_key = models.AutoField(primary_key=True)
    creation = models.DateTimeField(auto_now_add=True, blank=True)
    first_name = models.CharField(max_length=35)
    middle_name = models.CharField(max_length=35, null=True)
    last_name = models.CharField(max_length=35)
    email = models.EmailField(max_length=100)
    is_subscriber = models.BooleanField(default=True)
    user_id = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    
#Mail list
class MailList(models.Model):
    index_key = models.AutoField(primary_key=True)
    label = models.CharField(max_length=100, null=False)
    recipients = models.ManyToManyField(Subscribers)

#Mail campaign
class Campaign(models.Model):
    index_key = models.AutoField(primary_key=True)
    mail_list = models.ForeignKey(MailList, on_delete=models.CASCADE)
    date = models.DateTimeField(null=False)
    subject = models.TextField(max_length=500) 
    message = models.TextField(max_length=2000) 

