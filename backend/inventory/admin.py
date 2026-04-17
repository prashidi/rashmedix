from django.contrib import admin
from .models import Medicine, Category, Supplier, StockTransaction

admin.site.register(Medicine)
admin.site.register(Category)
admin.site.register(Supplier)
admin.site.register(StockTransaction)
