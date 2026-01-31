from config import db
from models import Product, InventoryAlert, DeliveryZone

# WARNING: This will drop existing demo data if run multiple times
# Run only in development

def seed_inventory_alerts():
    # Example: Monitor low-stock products
    demo_alerts = [
        InventoryAlert(product_id=1, threshold=10),
        InventoryAlert(product_id=2, threshold=5),
        InventoryAlert(product_id=3, threshold=8),
    ]
    for alert in demo_alerts:
        db.session.add(alert)
    db.session.commit()
    print("Seeded InventoryAlerts.")

def seed_delivery_zones():
    # Example: Define delivery zones
    demo_zones = [
        DeliveryZone(zone_name="Downtown", delivery_fee=100),
        DeliveryZone(zone_name="Uptown", delivery_fee=150),
        DeliveryZone(zone_name="Suburbs", delivery_fee=200),
    ]
    for zone in demo_zones:
        db.session.add(zone)
    db.session.commit()
    print("Seeded DeliveryZones.")

if __name__ == "__main__":
    print("Starting seeding...")
    seed_inventory_alerts()
    seed_delivery_zones()
    print("Seeding complete.")
