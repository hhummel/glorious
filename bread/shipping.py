import logging
from typing import List

from django.utils import timezone
from .models import Order, Shipment, Ledger

logger = logging.Logger('bread')

def coalesce(objects: list, attribute:str):
    """Find the first non-null value for the data attribute in a list of objects"""
    values = [getattr(element, attribute) for element in objects if getattr(element, attribute)]
    return values[0] if values else None


def parcel_cost(shipment_items: List[Order]) -> float:
    """
    Calculate cost of sending shipment_items. This is the price charged to the customer
    The real cost would reflect the number of items and the distance sent.
    TODO: Get expected postage cost from USPS. Pricing should also represent packaging and delivery to Post Ofice
    TODO: Crude estimate for shipping cost, ignoring number of items, weight or distance
    TODO: Here I simply return a constant
    """
    PARCEL_COST = 12
    return PARCEL_COST


def get_shipping_list(cart):
    """
    Create a list of lists of Orders to be shipped. The sublist is the constituent items in the shipment
    """
    # Get Orders from cart
    shipped_orders = Order.objects.select_related().filter(cart_id = cart).filter(ship_this = True)

    # Orders that are not a gift go to the user's address
    non_gifts = list(shipped_orders.filter(this_is_a_gift = False))

    gifts = list(shipped_orders.filter(this_is_a_gift = True))

    # Consolidate gifts by recipient, address and zip
    consolidated_gift_keys = {(
        gift.recipient_name,
        gift.recipient_address,
        gift.recipient_zip) for gift in gifts
    }

    # shipment_list contains a list of Order lists, consolidated by shipping recipient and destination 
    shipping_list =  [non_gifts] if non_gifts else []
    for key in consolidated_gift_keys:
        matched = [gift for gift in gifts if
                key[0] == gift.recipient_name and
                key[1] == gift.recipient_address and
                key[2] == gift.recipient_zip
        ]
        shipping_list.append(matched)

    return shipping_list


def get_shipping_cost(shipping_list):
    """Calculate shipping cost for a shipping list"""
    if not shipping_list:
        return 0
    return sum([parcel_cost(shipment) for shipment in shipping_list])


def create_shipping_objects(cart):
    """
    Consolidate Orders in cart into Shipments, get ocst and create Ledger entries
    """

    shipping_list = get_shipping_list(cart)

    # Create Shipment and Legder objects for shipments
    for shipment in shipping_list:
        # Create a Shipment object
        first = shipment[0]
        shipment_object = Shipment.objects.create(
            user=first.user,
            shipper='USPS',
            cost=parcel_cost(shipment),
            order_date=first.order_date,
            this_is_a_gift=first.this_is_a_gift,
            special_instructions=coalesce(shipment, 'special_instructions'),
            meister=first.meister,
            recipient_name=first.recipient_name,
            recipient_address=first.recipient_address,
            recipient_city=first.recipient_city,
            recipient_state=first.recipient_state,
            recipient_zip=first.recipient_zip,            
            recipient_message=coalesce(shipment, 'recipient_message'),
            cart=cart,
        )

        # Associate constituent orders with shipment foreign key
        for order in shipment:
            order.shipment = shipment_object
            order.save()

        # Create a Ledger object
        Ledger.objects.create(
            user=shipment_object.user,
            quantity=shipment_object.cost,
            credit=False,
            non_cash=True,
            cancelled=False,
            shipment_reference=shipment_object,
            date=timezone.datetime.now(tz=timezone.utc),
        )

    # Return total cost of shipments
    return get_shipping_cost(shipping_list)
