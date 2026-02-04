#!/usr/bin/env python3
from random import choice, randint, sample
from faker import Faker
from config import app, db
from models import (User, Role, Product, Service, Category, Review, 
                    DeliveryZone, InventoryAlert, Order, OrderItem, 
                    Payment, Cart, CartItem, Appointment, OrderStatusHistory)

fake = Faker()

def make_seed():
    with app.app_context():
        print("Clearing database...")
        db.drop_all()
        db.create_all()

        print("Creating Roles...")
        admin_role = Role(name="Admin")
        user_role = Role(name="User")
        db.session.add_all([admin_role, user_role])
        db.session.commit()

        print("Creating Categories...")
        # Product Categories
        p_cat_names = ["Pet Food", "Toys", "Grooming Tools", "Medicine", "Accessories"]
        p_categories = [Category(name=n, category_type="Product") for n in p_cat_names]
        # Service Categories
        s_cat_names = ["Veterinary", "Grooming", "Training", "Pet Sitting"]
        s_categories = [Category(name=n, category_type="Service") for n in s_cat_names]
        db.session.add_all(p_categories + s_categories)
        db.session.commit()

        print("Creating Delivery Zones...")
        zones = [
            DeliveryZone(zone_name="Nairobi CBD", delivery_fee=200),
            DeliveryZone(zone_name="Westlands", delivery_fee=300),
            DeliveryZone(zone_name="Karen", delivery_fee=500),
            DeliveryZone(zone_name="Kiambu", delivery_fee=450),
        ]
        db.session.add_all(zones)

        print("Creating Products...")
        products = []
        for _ in range(20):
            p = Product(
                name=fake.catch_phrase(),
                description=fake.paragraph(nb_sentences=2),
                image_url="https://loremflickr.com/320/240/pet",
                price=randint(500, 5000),
                stock_quantity=randint(2, 50),
                category=choice(p_categories)
            )
            products.append(p)
        db.session.add_all(products)
        db.session.commit()

        print("Creating Inventory Alerts for low stock items...")
        for p in products:
            if p.stock_quantity < 10:
                alert = InventoryAlert(product=p, threshold=10)
                db.session.add(alert)

        print("Creating Services...")
        services = []
        for name in ["Full Vaccination", "Dental Cleaning", "Behavioral Training", "Summer Haircut"]:
            s = Service(
                name=name,
                description=fake.sentence(),
                image_url="https://loremflickr.com/320/240/vet",
                base_price=randint(1500, 10000),
                category=choice(s_categories)
            )
            services.append(s)
        db.session.add_all(services)
        db.session.commit()

        print("Creating Users and Carts...")
        users = []
        # Create 1 Admin
        admin = User(username="admin_vet", email="admin@vetty.com", role=admin_role)
        admin.password = "admin123"
        users.append(admin)
        
        # Create 10 Users
        for _ in range(10):
            u = User(
                username=fake.user_name(),
                email=fake.unique.email(),
                role=user_role
            )
            u.password = "password123"
            users.append(u)
        db.session.add_all(users)
        db.session.commit()

        # Create Carts for users
        for u in users:
            c = Cart(user=u)
            db.session.add(c)
        db.session.commit()

        print("Populating Orders, Appointments, and Reviews...")
        for u in users:
            # 1. Appointments
            if randint(0, 1):
                app_date = fake.date_time_between(start_date='now', end_date='+30d')
                appt = Appointment(
                    user=u, service=choice(services), 
                    appointment_date=app_date, 
                    status="Scheduled",
                    total_price=randint(2000, 5000),
                    notes="Please handle with care."
                )
                db.session.add(appt)

            # 2. Orders
            if randint(0, 1):
                order = Order(
                    user=u, 
                    delivery_zone=choice(zones),
                    status=choice(["Pending", "Approved", "Delivered"])
                )
                db.session.add(order)
                db.session.flush() # Get order ID

                # Add Order Items
                for p in sample(products, randint(1, 3)):
                    item = OrderItem(
                        order=order, product=p, 
                        quantity=randint(1, 2), 
                        unit_price=p.price
                    )
                    db.session.add(item)
                
                # Add Status History
                history = OrderStatusHistory(order=order, status=order.status)
                db.session.add(history)

                # Add Payment (Success)
                payment = Payment(
                    user=u, order=order, 
                    payment_method="M-Pesa",
                    amount=randint(1000, 5000),
                    status="success",
                    mpesa_receipt_number=fake.bothify(text='??#?#?#?#?').upper()
                )
                db.session.add(payment)

            # 3. Reviews
            if randint(0, 1):
                rev = Review(
                    user=u,
                    comment=fake.sentence(),
                    rating=randint(3, 5),
                    product=choice(products) if randint(0,1) else None,
                    service=None if randint(0,1) else choice(services)
                )
                # Ensure the review targets exactly one
                if not rev.product and not rev.service:
                    rev.product = products[0]
                elif rev.product and rev.service:
                    rev.service = None
                db.session.add(rev)

        db.session.commit()
        print("Seeding complete!")

if __name__ == "__main__":
    make_seed()