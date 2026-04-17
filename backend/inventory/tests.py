from django.test import TestCase
from .models import Category, Supplier, Medicine


class CategoryModelTest(TestCase):
    def test_category_creation(self):
        cat = Category.objects.create(name='Antibiotics')
        self.assertEqual(str(cat), 'Antibiotics')


class MedicineModelTest(TestCase):
    def test_stock_status_out_of_stock(self):
        cat = Category.objects.create(name='Test')
        sup = Supplier.objects.create(
            name='Test Supplier',
            contact_email='test@test.com'
        )
        med = Medicine(
            name='Test Med',
            category=cat,
            supplier=sup,
            unit_price='5.00',
            quantity_in_stock=0,
            reorder_level=10
        )
        self.assertEqual(med.stock_status, 'out_of_stock')

    def test_stock_status_low_stock(self):
        cat = Category.objects.create(name='Test2')
        sup = Supplier.objects.create(
            name='Test Supplier 2',
            contact_email='test2@test.com'
        )
        med = Medicine(
            name='Test Med 2',
            category=cat,
            supplier=sup,
            unit_price='5.00',
            quantity_in_stock=5,
            reorder_level=10
        )
        self.assertEqual(med.stock_status, 'low_stock')
