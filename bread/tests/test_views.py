from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APITestCase 
from rest_framework import status

from bread.models import Category, Products, Order

BASE_URL = "http://localhost:8000"


class OrderViewSetTest(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='test_user', password='1234')
        category = Category.objects.create(category='test', label='test')
        product = Products.objects.create(category=category, product='test', label='test', price=10)
        order = Order.objects.create(
            user=cls.user, 
            product=product, 
            number=1,
            delivery_date=timezone.datetime.today(),
            order_date=timezone.datetime.now(),
            standing=False,
            confirmed=False,
            delivered=False,
            this_is_a_gift=False
        )
        cls.orders = [order]

    def test_can_browse_orders_without_login(self):
        response = self.client.get(f'{BASE_URL}/bread/order/')
        self.assertEquals(status.HTTP_200_OK, response.status_code)
        self.assertEquals(len(self.orders), len(response.data))

    def test_can_browse_order_detail_with_login(self):
        self.client.login(username='test_user', password='1234')
        response = self.client.get(f'{BASE_URL}/bread/order/')
        self.assertEquals(status.HTTP_200_OK, response.status_code)
        self.assertEquals(len(self.orders), len(response.data))
    
    def test_can_browse_pending_order_detail_with_good_login(self):
        self.client.login(username='test_user', password='1234')
        response = self.client.get(f'{BASE_URL}/bread/order/1/pending/')
        self.assertEquals(status.HTTP_200_OK, response.status_code)


    