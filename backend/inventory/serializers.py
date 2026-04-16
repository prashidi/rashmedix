from rest_framework import serializers
from .models import Supplier, Category, Medicine, StockTransaction

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    stock_status = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)

    class Meta:
        model = Medicine
        fields = '__all__'

class StockTransactionSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)

    class Meta:
        model = StockTransaction
        fields = '__all__'
