from django.utils import timezone
from django.conf import settings
from django.db import models


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

SHIPPER_CHOICES = (
    ('USPS', 'US Postal Service'),
    ('FEDEX', 'FedEx'),
    ('UPS', 'UPS'),
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
    ('4_WKS', 'Every four weeks'),
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
# Days of the week when bread is not available, Sunday = 0 to be consistent with datetimepicker. Using array
# so js interprets it as an array.
EXCLUDED_DAYS = [0, 1, 3, 4, 6]
MEISTER_EXCLUDED_DAYS = []


def next_day():
    """
    Helper function to find the next allowed delivery date, given the excluded days of the week in EXCLUDED_DAYS
    """
    dow = timezone.datetime.today().weekday()
    # datetimepicker uses days of the week with Sunday = 0, but django uses Monday = 0.
    # Use picker so EXCLUDED_DAYS works.
    # Increment by 2 to adjust the day of week convention and because it starts tomorrow
    picker_dow = (dow + 2) % 7
    # Start with tomorrow as candidate, and then go days until the candidate isn't excluded
    days = 1
    while picker_dow in EXCLUDED_DAYS:
        days = days + 1
        picker_dow = (picker_dow + 1) % 7
    return days 


class Contacts(models.Model):
    """
    Contact information.  Note create is the creation time of the contact object in UTC
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
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


class Category(models.Model):
    """Product categories"""
    index_key = models.AutoField(primary_key=True)
    category = models.CharField(max_length=17)
    label = models.CharField(max_length=100, null=False)
    blurb = models.CharField(max_length=500, null=True)
    picture = models.CharField(max_length=500, null=True)
    font_color = models.CharField(max_length=15, null=True)


class Products(models.Model):
    """Products"""
    index_key = models.AutoField(primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    product = models.CharField(max_length=17)
    label = models.CharField(max_length=100, null=False)
    price = models.IntegerField(null=False)
    picture = models.CharField(max_length=500, null=True)

    def __str__(self):
        return_string =  self.label + "  $" + str(self.price)
        return return_string


class MaterialCategory(models.Model):
    """ Material categories"""
    index_key = models.AutoField(primary_key=True)
    category = models.CharField(max_length=17)
    label = models.CharField(max_length=100, null=False)
    super_cat = models.CharField(max_length=6, choices=CAT_CHOICES, default='DRY', null=False)
    display_order = models.IntegerField(null=True)
    picture = models.CharField(max_length=500, null=True)


class Materials(models.Model):
    """Materials"""
    index_key = models.AutoField(primary_key=True)
    category = models.ForeignKey(MaterialCategory, on_delete=models.CASCADE, default=1)
    product = models.CharField(max_length=17)
    label = models.CharField(max_length=100, null=False)
    quantity = models.FloatField(null=False)
    measure = models.CharField(max_length=6, choices=MEASURE_CHOICES, null=False)
    units = models.CharField(max_length=6, null=True)
    picture = models.CharField(max_length=500, null=True)


class ShoppingCart(models.Model):
    """Object for ordered line items and payment intent"""
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateTimeField(null=False)
    confirmed = models.BooleanField(default=False)


class Shipment(models.Model):
    """Shipping information."""
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    shipper = models.CharField(max_length=6, choices=SHIPPER_CHOICES, default='USPS')
    cost = models.FloatField(null=True) 
    tracking_number = models.CharField(max_length=100, null=True, blank=True)
    order_date = models.DateTimeField(null=False, default=timezone.datetime.now())
    shipping_date = models.DateField(null=True)
    delivery_date = models.DateField(null=True)
    confirmed = models.BooleanField(default=False)
    shipped = models.BooleanField(default=False)
    delivered = models.BooleanField(default=False)
    special_instructions = models.TextField(max_length=150, null=True, blank=True)
    this_is_a_gift = models.BooleanField(default=False)
    meister = models.BooleanField(default=False)
    recipient_name = models.CharField(max_length=100, null=True, blank=True)
    recipient_address = models.CharField(max_length=100, null=True, blank=True)
    recipient_city = models.CharField(max_length=100, null=True, blank=True)
    recipient_state = models.CharField(max_length=100, null=True, blank=True)
    recipient_zip = models.CharField(max_length=100, null=True, blank=True)
    recipient_message = models.TextField(max_length=5, null=True, blank=True)
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE, null=True)


class Order(models.Model):
    """Order information."""
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
    ship_this = models.BooleanField(default=False)
    meister = models.BooleanField(default=False)
    recipient_name = models.CharField(max_length=100, null=True, blank=True)
    recipient_address = models.CharField(max_length=100, null=True, blank=True)
    recipient_city = models.CharField(max_length=100, null=True, blank=True)
    recipient_state = models.CharField(max_length=100, null=True, blank=True)
    recipient_zip = models.CharField(max_length=100, null=True, blank=True)
    recipient_message = models.TextField(max_length=5, null=True, blank=True)
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE, null=True)
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, null=True) 


class Expense(models.Model):
    """Expense information."""
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    material = models.ForeignKey(Materials, on_delete=models.CASCADE)
    number = models.IntegerField(null=False, default=1)
    price = models.FloatField(null=False)
    payment_method = models.CharField(max_length=3, choices=PAYMENT_CHOICES)
    expense_date = models.DateTimeField(null=False)
    confirmed = models.BooleanField(default=False)
    special_instructions = models.TextField(max_length=150, null=True, blank=True) 


class Subscription(models.Model):
    """Subscription information"""
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


class ProductSubscription(models.Model):
    """Product subscription information"""
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    number = models.IntegerField(null=False, default=1)
    frequency = models.CharField(max_length=6, choices=SUBSCRIPTION_CHOICES, default='WKLY')
    total_deliveries = models.IntegerField(null=False, default=52)
    completed_deliveries = models.IntegerField(null=False, default=52)
    confirmed = models.BooleanField(default=False)
    auto_renew = models.BooleanField(default=False)
    special_instructions = models.TextField(max_length=500, null=True, blank=True) 
    this_is_a_gift = models.BooleanField(default=False)
    recipient_name = models.CharField(max_length=100, null=True, blank=True)
    recipient_address = models.CharField(max_length=100, null=True, blank=True)
    recipient_city = models.CharField(max_length=100, null=True, blank=True)
    recipient_state = models.CharField(max_length=2, choices=STATE_CHOICES, default='PA', null=True)    


class Gift(models.Model):
    """Gift recipient details"""
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


# Payment information
class Payment(models.Model):
    """An actual payment recorded in the Ledger"""
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=6, decimal_places=2, null=False)
    date = models.DateField(null=False)
    payment_method = models.CharField(max_length=3, choices=PAYMENT_CHOICES)
    confirmed = models.BooleanField(default=False)
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE, null=True)


# Refund information
class Refund(models.Model):
    """A payment refund recorded in the Ledger"""
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=6, decimal_places=2, null=False)
    date = models.DateTimeField(null=False)
    refund_method = models.CharField(max_length=3, choices=PAYMENT_CHOICES)
    refund_id = models.CharField(max_length=234)
    confirmed = models.BooleanField(default=False)
    reason = models.CharField(max_length=100, null=True)
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE, null=True)


# Stripe charge
class PaymentIntent(models.Model):
    """An intent to pay, by card transaction or selecting cash or Venmo"""
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    value = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    date = models.DateTimeField(null=True)
    payment_method = models.CharField(max_length=3, choices=PAYMENT_CHOICES, null=True)
    payment_reference = models.ForeignKey(Payment, on_delete=models.CASCADE, null=True)
    refund_reference = models.ForeignKey(Refund, on_delete=models.CASCADE, null=True)
    payment_intent_id = models.CharField(max_length=234)
    success = models.BooleanField(null=True)
    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE, null=True)


class Ledger(models.Model):
    """Credit or debit"""
    index_key = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=6, decimal_places=2, null=False)
    credit = models.BooleanField(default=True)
    non_cash = models.BooleanField(default=True)
    cancelled = models.BooleanField(default=True)
    order_reference = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    payment_reference = models.ForeignKey(Payment, on_delete=models.CASCADE, null=True)
    refund_reference = models.ForeignKey(Refund, on_delete=models.CASCADE, null=True)
    expense_reference = models.ForeignKey(Expense, on_delete=models.CASCADE, null=True)
    shipment_reference = models.ForeignKey(Shipment, on_delete=models.CASCADE, null=True) 
    date = models.DateTimeField(null=False)


class Subscribers(models.Model):
    """ Mailing list subscribers"""
    index_key = models.AutoField(primary_key=True)
    creation = models.DateTimeField(auto_now_add=True, blank=True)
    first_name = models.CharField(max_length=35)
    middle_name = models.CharField(max_length=35, null=True)
    last_name = models.CharField(max_length=35)
    email = models.EmailField(max_length=100)
    is_subscriber = models.BooleanField(default=True)
    user_id = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)


class MailList(models.Model):
    """Mail list"""
    index_key = models.AutoField(primary_key=True)
    label = models.CharField(max_length=100, null=False)
    recipients = models.ManyToManyField(Subscribers)


class Campaign(models.Model):
    """Mail campaign"""
    index_key = models.AutoField(primary_key=True)
    mail_list = models.ForeignKey(MailList, on_delete=models.CASCADE)
    date = models.DateTimeField(null=False)
    subject = models.TextField(max_length=500) 
    message = models.TextField(max_length=2000) 
