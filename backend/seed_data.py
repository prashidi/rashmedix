from inventory.models import Category, Supplier, Medicine

cat1, _ = Category.objects.get_or_create(
    name="Antibiotics", defaults={"description": "Bacterial infection treatments"}
)
cat2, _ = Category.objects.get_or_create(
    name="Analgesics", defaults={"description": "Pain relief medications"}
)
cat3, _ = Category.objects.get_or_create(
    name="Antidiabetics", defaults={"description": "Diabetes management"}
)
cat4, _ = Category.objects.get_or_create(
    name="Cardiovascular", defaults={"description": "Heart and blood pressure"}
)

sup1, _ = Supplier.objects.get_or_create(
    contact_email="orders@pharmaplus.ie",
    defaults={
        "name": "PharmaPlus Ireland",
        "phone": "+353 1 234 5678",
        "address": "Dublin 2, Ireland",
    },
)
sup2, _ = Supplier.objects.get_or_create(
    contact_email="supply@medhub.ie",
    defaults={
        "name": "MedHub Distributors",
        "phone": "+353 21 987 6543",
        "address": "Cork, Ireland",
    },
)

medicines = [
    dict(
        name="Amoxicillin 500mg",
        generic_name="Amoxicillin",
        category=cat1,
        supplier=sup1,
        unit="capsule",
        quantity_in_stock=250,
        reorder_level=50,
        unit_price="4.50",
        expiry_date="2026-12-31",
        batch_number="AMX2024A",
    ),
    dict(
        name="Paracetamol 500mg",
        generic_name="Paracetamol",
        category=cat2,
        supplier=sup1,
        unit="tablet",
        quantity_in_stock=8,
        reorder_level=100,
        unit_price="1.20",
        expiry_date="2026-06-30",
        batch_number="PCM2024B",
    ),
    dict(
        name="Metformin 850mg",
        generic_name="Metformin HCl",
        category=cat3,
        supplier=sup2,
        unit="tablet",
        quantity_in_stock=0,
        reorder_level=30,
        unit_price="3.75",
        expiry_date="2025-09-30",
        batch_number="MET2024C",
    ),
    dict(
        name="Ibuprofen 400mg",
        generic_name="Ibuprofen",
        category=cat2,
        supplier=sup2,
        unit="tablet",
        quantity_in_stock=320,
        reorder_level=60,
        unit_price="2.10",
        expiry_date="2027-03-31",
        batch_number="IBU2024D",
    ),
    dict(
        name="Atorvastatin 20mg",
        generic_name="Atorvastatin",
        category=cat4,
        supplier=sup1,
        unit="tablet",
        quantity_in_stock=5,
        reorder_level=40,
        unit_price="8.90",
        expiry_date="2026-11-30",
        batch_number="ATV2024E",
    ),
    dict(
        name="Lisinopril 10mg",
        generic_name="Lisinopril",
        category=cat4,
        supplier=sup2,
        unit="tablet",
        quantity_in_stock=180,
        reorder_level=30,
        unit_price="6.30",
        expiry_date="2026-08-31",
        batch_number="LIS2024F",
    ),
    dict(
        name="Clarithromycin 250mg",
        generic_name="Clarithromycin",
        category=cat1,
        supplier=sup1,
        unit="tablet",
        quantity_in_stock=12,
        reorder_level=25,
        unit_price="12.50",
        expiry_date="2025-12-31",
        batch_number="CLR2024G",
    ),
    dict(
        name="Insulin Glargine",
        generic_name="Insulin Glargine",
        category=cat3,
        supplier=sup2,
        unit="vial",
        quantity_in_stock=3,
        reorder_level=10,
        unit_price="45.00",
        expiry_date="2025-07-31",
        batch_number="INS2024H",
    ),
]

for m in medicines:
    Medicine.objects.get_or_create(name=m["name"], defaults=m)

print(
    f"Done: {Category.objects.count()} categories, {Supplier.objects.count()} suppliers, {Medicine.objects.count()} medicines"
)
