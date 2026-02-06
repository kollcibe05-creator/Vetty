#!/usr/bin/env python3

from random import choice, randint, sample
from faker import Faker
from config import app, db
from models import (
    User, Role, Product, Service, Category, Review,
    DeliveryZone, InventoryAlert, Order, OrderItem,
    Payment, Cart, Appointment, OrderStatusHistory
)

fake = Faker()

def make_seed():
    with app.app_context():
        print("Clearing database...")
        db.drop_all()
        db.create_all()

        # ---------------- ROLES ----------------
        print("Creating Roles...")
        admin_role = Role(name="Admin")
        user_role = Role(name="User")
        db.session.add_all([admin_role, user_role])
        db.session.commit()

        # ---------------- CATEGORIES ----------------
        print("Creating Categories...")
        p_categories = [
            Category(name=n, category_type="Product")
            for n in ["Pet Food", "Toys", "Grooming Tools", "Medicine", "Accessories"]
        ]

        s_categories = [
            Category(name=n, category_type="Service")
            for n in ["Veterinary", "Grooming", "Training", "Pet Sitting"]
        ]

        db.session.add_all(p_categories + s_categories)
        db.session.commit()

        # ---------------- DELIVERY ZONES ----------------
        print("Creating Delivery Zones...")
        zones = [
            DeliveryZone(zone_name="Nairobi CBD", delivery_fee=200),
            DeliveryZone(zone_name="Westlands", delivery_fee=300),
            DeliveryZone(zone_name="Karen", delivery_fee=500),
            DeliveryZone(zone_name="Kiambu", delivery_fee=450),
        ]
        db.session.add_all(zones)
        db.session.commit()

        # ---------------- PRODUCTS ----------------
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

        # ---------------- INVENTORY ALERTS ----------------
        print("Creating Inventory Alerts...")
        for p in products:
            if p.stock_quantity < 10:
                db.session.add(InventoryAlert(product=p, threshold=10))
        db.session.commit()

        # ---------------- SERVICES ----------------
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

        # ---------------- USERS & CARTS ----------------
        print("Creating Users and Carts...")
        users = []

        admin = User(
            username="admin_vet",
            email="admin@vetty.com",
            role=admin_role
        )
        admin.password = "admin123"
        users.append(admin)

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

        for u in users:
            db.session.add(Cart(user=u))
        db.session.commit()

        # ---------------- ORDERS / APPOINTMENTS / REVIEWS ----------------
        print("Populating Orders, Appointments, and Reviews...")
        for u in users:

            # Appointments
            if randint(0, 1):
                appt = Appointment(
                    user=u,
                    service=choice(services),
                    appointment_date=fake.date_time_between(start_date='now', end_date='+30d'),
                    status="Scheduled",
                    total_price=randint(2000, 5000),
                    notes="Please handle with care."
                )
                db.session.add(appt)

            # Orders
            if randint(0, 1):
                order = Order(
                    user=u,
                    delivery_zone=choice(zones),
                    status=choice(["Pending", "Approved", "Delivered"])
                )
                db.session.add(order)
                db.session.flush()

                for p in sample(products, randint(1, 3)):
                    qty = randint(1, 2)
                    p.stock_quantity = max(p.stock_quantity - qty, 0)

                    db.session.add(OrderItem(
                        order=order,
                        product=p,
                        quantity=qty,
                        unit_price=p.price
                    ))

                db.session.add(OrderStatusHistory(order=order, status=order.status))

                db.session.add(Payment(
                    user=u,
                    order=order,
                    payment_method="M-Pesa",
                    amount=randint(1000, 5000),
                    status="Completed",
                    mpesa_receipt_number=fake.bothify("MP#######")
                ))

            # Reviews (exactly ONE target)
            if randint(0, 1):
                if randint(0, 1):
                    review = Review(
                        user=u,
                        product=choice(products),
                        service=None,
                        rating=randint(3, 5),
                        comment=fake.sentence()
                    )
                else:
                    review = Review(
                        user=u,
                        product=None,
                        service=choice(services),
                        rating=randint(3, 5),
                        comment=fake.sentence()
                    )
                db.session.add(review)

        db.session.commit()
        print("✅ Seeding complete!")

if __name__ == "__main__":
    make_seed()
