from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, CategoryViewSet, MedicineViewSet, StockTransactionViewSet

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'medicines', MedicineViewSet)
router.register(r'transactions', StockTransactionViewSet)

urlpatterns = router.urls
