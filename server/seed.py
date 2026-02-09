import random
from datetime import datetime, timedelta
from faker import Faker
from app import app
from models import (
    db, User, Role, Category, Product, Service, DeliveryZone, 
    InventoryAlert, Order, OrderItem, Review, Appointment, 
    Cart, CartItem, Payment, OrderStatusHistory
)

fake = Faker()

def seed_data():
    with app.app_context():
        print("🚀 Deleting existing data in dependency order...")
        # Reversed order to satisfy Foreign Key constraints
        models_to_delete = [
            OrderItem, OrderStatusHistory, Payment, Order, Appointment, 
            Review, CartItem, Cart, InventoryAlert, Product, Service, 
            Category, DeliveryZone, User, Role
        ]
        for model in models_to_delete:
            db.session.query(model).delete()
        db.session.commit()

        print("🎭 Creating Roles...")
        admin_role = Role(name="Admin")
        customer_role = Role(name="User")
        db.session.add_all([admin_role, customer_role])
        db.session.commit()

        print("📂 Creating Categories...")
        # Product categories
        p_cats = ["Pet Food", "Pet Supplies", "Toys"]
        # Service categories
        s_cats = ["Grooming", "Veterinary", "Training"]
        
        all_cats = []
        for name in p_cats:
            cat = Category(name=name, category_type="Product")
            db.session.add(cat)
            all_cats.append(cat)
        for name in s_cats:
            cat = Category(name=name, category_type="Service")
            db.session.add(cat)
            all_cats.append(cat)
        db.session.commit()

        print("📍 Creating Delivery Zones...")
        zones = [
            DeliveryZone(zone_name="Downtown", delivery_fee=200),
            DeliveryZone(zone_name="Suburbs", delivery_fee=500),
        ]
        db.session.add_all(zones)
        db.session.commit()

        print("👥 Creating Users...")
        admin = User(username="admin_jane", email="admin@vetty.com", role_id=admin_role.id, vetting_status="approved")
        admin.password = "admin123"
        db.session.add(admin)

        customers = []
        for _ in range(10):
            u = User(
                username=fake.user_name(),
                email=fake.email(),
                role_id=customer_role.id,
                vetting_status="approved"
            )
            u.password = "password123"
            db.session.add(u)
            customers.append(u)
        db.session.commit()

        print("📦 Creating Products...")
        products = []
        product_categories = [c for c in all_cats if c.category_type == "Product"]
        for i in range(25):
            p = Product(
                name=f"{fake.word().capitalize()} {random.choice(['Mix', 'Pro', 'Plus'])}",
                description=fake.sentence(),
                image_url=f"https://loremflickr.com/400/400/pet,product?lock={i}",
                price=random.randint(400, 5000),
                stock_quantity=random.randint(5, 50),
                category_id=random.choice(product_categories).id
            )
            db.session.add(p)
            products.append(p)

        print("✂️ Creating Services...")
        services = []
        service_categories = [c for c in all_cats if c.category_type == "Service"]
        for i in range(25):
            s = Service(
                name=f"{random.choice(service_categories).name} {fake.word().capitalize()}",
                description=fake.sentence(),
                image_url=f"https://loremflickr.com/400/400/pet,grooming?lock={i}",
                base_price=random.randint(1000, 8000),
                category_id=random.choice(service_categories).id
            )
            db.session.add(s)
            services.append(s)
        db.session.commit()

        print("🛒 Creating Orders (Fixed Validation)...")
        for _ in range(5):
            # Using "Pending" as it is the most common valid status in your logic
            order = Order(
                user_id=random.choice(customers).id,
                delivery_zone_id=random.choice(zones).id,
                status="Pending" 
            )
            db.session.add(order)
            db.session.flush()

            item = OrderItem(
                order_id=order.id,
                product_id=random.choice(products).id,
                quantity=random.randint(1, 3),
                unit_price=1000 # Simplified for seed
            )
            db.session.add(item)

        print("📅 Creating Appointments...")
        for _ in range(10):
            appt = Appointment(
                user_id=random.choice(customers).id,
                service_id=random.choice(services).id,
                appointment_date=datetime.now() + timedelta(days=random.randint(1, 10)),
                status="Scheduled",
                total_price=3000
            )
            db.session.add(appt)

        db.session.commit()
        print("\n✨ SEEDING COMPLETE! ✨")

if __name__ == "__main__":
    seed_data()