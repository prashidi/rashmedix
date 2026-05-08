from django.core.management.base import BaseCommand
from inventory.models import Category, Supplier, Medicine, StockTransaction


class Command(BaseCommand):
    help = "Seed RashMedix database with demo data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            StockTransaction.objects.all().delete()
            Medicine.objects.all().delete()
            Supplier.objects.all().delete()
            Category.objects.all().delete()

        self.stdout.write("Seeding categories...")
        cat1, _ = Category.objects.get_or_create(
            name="Antibiotics",
            defaults={"description": "Bacterial infection treatments"},
        )
        cat2, _ = Category.objects.get_or_create(
            name="Analgesics", defaults={"description": "Pain relief medications"}
        )
        cat3, _ = Category.objects.get_or_create(
            name="Antidiabetics",
            defaults={"description": "Diabetes management medications"},
        )
        cat4, _ = Category.objects.get_or_create(
            name="Cardiovascular",
            defaults={"description": "Heart and blood pressure medications"},
        )
        cat5, _ = Category.objects.get_or_create(
            name="Respiratory",
            defaults={"description": "Asthma and respiratory conditions"},
        )

        self.stdout.write("Seeding suppliers...")
        sup1, _ = Supplier.objects.get_or_create(
            contact_email="orders@pharmaplus.ie",
            defaults={
                "name": "PharmaPlus Ireland",
                "phone": "+353 1 234 5678",
                "address": "12 Grafton Street, Dublin 2, Ireland",
            },
        )
        sup2, _ = Supplier.objects.get_or_create(
            contact_email="supply@medhub.ie",
            defaults={
                "name": "MedHub Distributors",
                "phone": "+353 21 987 6543",
                "address": "45 Patrick Street, Cork, Ireland",
            },
        )
        sup3, _ = Supplier.objects.get_or_create(
            contact_email="wholesale@irishmed.ie",
            defaults={
                "name": "IrishMed Wholesale",
                "phone": "+353 91 765 4321",
                "address": "8 Eyre Square, Galway, Ireland",
            },
        )

        self.stdout.write("Seeding medicines...")
        medicines = [
            # In stock — normal levels
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
                description="Broad-spectrum antibiotic",
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
                description="Non-steroidal anti-inflammatory",
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
                description="ACE inhibitor for blood pressure",
            ),
            dict(
                name="Salbutamol 100mcg",
                generic_name="Salbutamol",
                category=cat5,
                supplier=sup3,
                unit="vial",
                quantity_in_stock=95,
                reorder_level=20,
                unit_price="8.75",
                expiry_date="2026-10-31",
                batch_number="SAL2024J",
                description="Bronchodilator inhaler",
            ),
            dict(
                name="Omeprazole 20mg",
                generic_name="Omeprazole",
                category=cat2,
                supplier=sup1,
                unit="capsule",
                quantity_in_stock=200,
                reorder_level=40,
                unit_price="3.20",
                expiry_date="2027-01-31",
                batch_number="OMP2024K",
                description="Proton pump inhibitor",
            ),
            # Low stock — triggers alerts
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
                description="Common analgesic and antipyretic",
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
                description="Statin for cholesterol management",
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
                description="Macrolide antibiotic",
            ),
            # Out of stock
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
                description="First-line type 2 diabetes treatment",
            ),
            dict(
                name="Insulin Glargine 100u/ml",
                generic_name="Insulin Glargine",
                category=cat3,
                supplier=sup2,
                unit="vial",
                quantity_in_stock=3,
                reorder_level=10,
                unit_price="45.00",
                expiry_date="2025-07-31",
                batch_number="INS2024H",
                description="Long-acting insulin analogue",
            ),
        ]

        for m in medicines:
            med, created = Medicine.objects.get_or_create(name=m["name"], defaults=m)
            if created:
                self.stdout.write(f"  Created: {med.name}")

        self.stdout.write("Seeding stock transactions...")
        med_amox = Medicine.objects.get(name="Amoxicillin 500mg")
        med_para = Medicine.objects.get(name="Paracetamol 500mg")
        med_met = Medicine.objects.get(name="Metformin 850mg")

        transactions = [
            dict(
                medicine=med_amox,
                transaction_type="restock",
                quantity=100,
                notes="Monthly restock from PharmaPlus",
            ),
            dict(
                medicine=med_amox,
                transaction_type="dispensed",
                quantity=-20,
                notes="Dispensed to patients",
            ),
            dict(
                medicine=med_para,
                transaction_type="dispensed",
                quantity=-92,
                notes="High demand period",
            ),
            dict(
                medicine=med_met,
                transaction_type="expired",
                quantity=-30,
                notes="Batch MET2023Z expired",
            ),
        ]

        for t in transactions:
            StockTransaction.objects.get_or_create(
                medicine=t["medicine"],
                transaction_type=t["transaction_type"],
                quantity=t["quantity"],
                defaults={"notes": t["notes"]},
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone!"
                f"\n  Categories:   {Category.objects.count()}"
                f"\n  Suppliers:    {Supplier.objects.count()}"
                f"\n  Medicines:    {Medicine.objects.count()}"
                f"\n  Transactions: {StockTransaction.objects.count()}"
                f"\n  Low stock:    "
                f"{sum(1 for m in Medicine.objects.all() if m.is_low_stock)}"
                f"\n  Out of stock: "
                f"{Medicine.objects.filter(quantity_in_stock=0).count()}"
            )
        )
