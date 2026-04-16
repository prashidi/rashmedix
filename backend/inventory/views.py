from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Supplier, Category, Medicine, StockTransaction
from .serializers import (
    SupplierSerializer, CategorySerializer,
    MedicineSerializer, StockTransactionSerializer
)

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'contact_email']

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.select_related('category', 'supplier').all()
    serializer_class = MedicineSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'generic_name', 'batch_number']
    ordering_fields = ['name', 'quantity_in_stock', 'expiry_date', 'unit_price']

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        low = self.queryset.filter(
            quantity_in_stock__lte=models_low_stock_filter()
        )
        serializer = self.get_serializer(low, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        medicines = Medicine.objects.all()
        return Response({
            'total_medicines': medicines.count(),
            'low_stock_count': sum(1 for m in medicines if m.is_low_stock),
            'out_of_stock_count': medicines.filter(quantity_in_stock=0).count(),
            'total_suppliers': Supplier.objects.count(),
            'total_categories': Category.objects.count(),
        })

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        medicine = self.get_object()
        quantity = int(request.data.get('quantity', 0))
        transaction_type = request.data.get('transaction_type', 'adjustment')
        notes = request.data.get('notes', '')

        medicine.quantity_in_stock = max(0, medicine.quantity_in_stock + quantity)
        medicine.save()

        StockTransaction.objects.create(
            medicine=medicine,
            transaction_type=transaction_type,
            quantity=quantity,
            notes=notes,
        )

        serializer = self.get_serializer(medicine)
        return Response(serializer.data)

def models_low_stock_filter():
    from django.db.models import F
    return F('reorder_level')

class StockTransactionViewSet(viewsets.ModelViewSet):
    queryset = StockTransaction.objects.select_related('medicine').all()
    serializer_class = StockTransactionSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    http_method_names = ['get', 'post', 'head', 'options']
