""" Tests for views """
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status

from bread.models import Category, Ledger, Order, Payment, Products

BASE_URL = "http://localhost:8000"


class OrderViewSetTest(APITestCase):
    """Test special features of Order in views"""

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username='test_user',
            password='1234')
        category = Category.objects.create(category='test', label='test')
        product = Products.objects.create(category=category, product='test', label='test', price=10)
        cls.orders = [
            Order.objects.create(
                user=cls.user,
                product=product,
                number=1,
                delivery_date=timezone.datetime.today(),
                order_date=timezone.datetime.now(),
                standing=False,
                confirmed=True,
                delivered=False,
                this_is_a_gift=False
            ),
            Order.objects.create(
                user=cls.user,
                product=product,
                number=2,
                delivery_date=(timezone.datetime.today() - timezone.timedelta(days=1)).date(),
                order_date=timezone.datetime.now(),
                standing=False,
                confirmed=True,
                delivered=False,
                this_is_a_gift=False
            )
        ]

    def test_can_browse_products_without_login(self):
        """ Unauthenticated user should see products """
        response = self.client.get(f'{BASE_URL}/bread/products/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(response.data), 1)

    def test_cannot_browse_orders_without_login(self):
        """ Unauthenticated user should see products """
        with self.assertRaises(TypeError):
            self.client.get(f'{BASE_URL}/bread/order/')

    def test_can_browse_order_detail_with_login(self):
        """ Authenticated should see order detail """
        self.client.login(username='test_user', password='1234')
        response = self.client.get(f'{BASE_URL}/bread/order/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(self.orders), len(response.data))

    def test_can_browse_pending_order_detail_with_good_login(self):
        """ Authenticated should see pending orders """
        self.client.force_authenticate(user=OrderViewSetTest.user)
        response = self.client.get(f'{BASE_URL}/bread/order/{OrderViewSetTest.user.id}/pending/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['number'], 1)

    def test_can_browse_history_order_detail_with_good_login(self):
        """ Authenticated should see order history """
        self.client.force_authenticate(user=OrderViewSetTest.user)
        response = self.client.get(f'{BASE_URL}/bread/order/{OrderViewSetTest.user.id}/history/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['number'], 2)


class LedgerViewSetTest(APITestCase):
    """ Test for Ledger in views """

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username='test_user',
            password='1234'
        )
        category = Category.objects.create(category='test', label='test')
        product = Products.objects.create(category=category, product='test', label='test', price=10)
        orders = [
            Order.objects.create(
                user=cls.user,
                product=product,
                number=1,
                delivery_date=timezone.datetime.today(),
                order_date=timezone.datetime.now(),
                standing=False,
                confirmed=True,
                delivered=False,
                this_is_a_gift=False
            ),
            Order.objects.create(
                user=cls.user,
                product=product,
                number=2,
                delivery_date=(timezone.datetime.today() - timezone.timedelta(days=1)).date(),
                order_date=timezone.datetime.now(),
                standing=False,
                confirmed=True,
                delivered=False,
                this_is_a_gift=False
            )
        ]
        payments = [
            Payment.objects.create(
                user=cls.user,
                value = 19.00,
                date = timezone.datetime.today(),
                payment_method = 'CSH',
                confirmed = True
            ),
            Payment.objects.create(
                user=cls.user,
                value = 1.00,
                date = timezone.datetime.today(),
                payment_method = 'CSH',
                confirmed = True
            )
        ]
        cls.ledger = [
            Ledger.objects.create(
                user = cls.user,
                quantity = orders[0].product.price * orders[0].number,
                credit = False,
                non_cash = True,
                cancelled = False,
                order_reference = orders[0],
                payment_reference = None,
                expense_reference = None,
                date = (timezone.datetime.today() - timezone.timedelta(days=1)).date(),
            ),
            Ledger.objects.create(
                user = cls.user,
                quantity = orders[1].product.price * orders[1].number,
                credit = False,
                non_cash = True,
                cancelled = False,
                order_reference = orders[1],
                payment_reference = None,
                expense_reference = None,
                date = (timezone.datetime.today() - timezone.timedelta(days=2)).date(),
            ),
            Ledger.objects.create(
                user = cls.user,
                quantity = payments[0].value,
                credit = True,
                non_cash = False,
                cancelled = False,
                order_reference = None,
                payment_reference = payments[0],
                expense_reference = None,
                date = (timezone.datetime.today() - timezone.timedelta(days=3)).date(),
            ),
            Ledger.objects.create(
                user = cls.user,
                quantity = payments[1].value,
                credit = True,
                non_cash = False,
                cancelled = False,
                order_reference = None,
                payment_reference = payments[1],
                expense_reference = None,
                date = (timezone.datetime.today() - timezone.timedelta(days=4)).date(),
            ),
        ]

    def test_can_browse_ledger_detail_with_login(self):
        self.client.login(username="test_user", password="1234")
        self.client.force_authenticate(user=LedgerViewSetTest.user)
        response = self.client.get(f'{BASE_URL}/bread/ledger/?user/1/')
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(self.ledger), len(response.data))

    def test_can_see_credits_detail_with_login(self):
        self.client.login(username="test_user", password="1234")
        self.client.force_authenticate(user=LedgerViewSetTest.user)
        response = self.client.get(f'{BASE_URL}/bread/ledger/1/credits/')
        total = sum([float(item['quantity']) for item in response.data])
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(total, 20.0)

    def test_can_see_debits_detail_with_login(self):
        self.client.login(username="test_user", password="1234")
        self.client.force_authenticate(user=LedgerViewSetTest.user)
        response = self.client.get(f'{BASE_URL}/bread/ledger/1/debits/')
        total = sum([float(item['quantity']) for item in response.data])
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(total, 30.0)
