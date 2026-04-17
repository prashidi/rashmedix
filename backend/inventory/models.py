from django.db import models


class Supplier(models.Model):
    name = models.CharField(max_length=200)
    contact_email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']


class Medicine(models.Model):
    UNIT_CHOICES = [
        ('tablet', 'Tablet'),
        ('capsule', 'Capsule'),
        ('ml', 'Millilitre'),
        ('mg', 'Milligram'),
        ('box', 'Box'),
        ('vial', 'Vial'),
    ]

    name = models.CharField(max_length=200)
    generic_name = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='medicines'
    )
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.SET_NULL,
        null=True,
        related_name='medicines'
    )
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='tablet')
    quantity_in_stock = models.PositiveIntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=10)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField(null=True, blank=True)
    batch_number = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def is_low_stock(self):
        return self.quantity_in_stock <= self.reorder_level

    @property
    def stock_status(self):
        if self.quantity_in_stock == 0:
            return 'out_of_stock'
        elif self.is_low_stock:
            return 'low_stock'
        return 'in_stock'

    class Meta:
        ordering = ['name']


class StockTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('restock', 'Restock'),
        ('dispensed', 'Dispensed'),
        ('adjustment', 'Adjustment'),
        ('expired', 'Expired'),
    ]

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.medicine.name} ({self.quantity})"

    class Meta:
        ordering = ['-created_at']
