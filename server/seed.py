#!/usr/bin/env python3

from datetime import datetime, timedelta
from random import randint, choice
from faker import Faker

from config import app, db
from models import (
    Role, User,
    Category, Product, Service,
    Review,
    DeliveryZone, InventoryAlert,
    Cart, CartItem,
    Order, OrderItem, OrderStatusHistory,
    Appointment,
    Payment
)

fake = Faker()

def seed():

    print("Clearing database...")
    db.drop_all()
    db.create_all()

    print("Creating roles...")
    admin_role = Role(name="Admin")
    customer_role = Role(name="User")

    db.session.add_all([admin_role, customer_role])
    db.session.commit()

    print("Creating users...")
    admin = User(
        username="admin",
        email="admin@vetty.com",
        role_id=admin_role.id
    )
    admin.password = "admin123"

    users = []
    for i in range(5):
        user = User(
            username=fake.user_name(),
            email=fake.email(),
            role_id=customer_role.id
        )
        user.password = "password123"
        users.append(user)

    db.session.add(admin)
    db.session.add_all(users)
    db.session.commit()

    print("Creating categories...")

    product_categories = [
        Category(name="Pet Food", category_type="Product"),
        Category(name="Accessories", category_type="Product"),
    ]

    service_categories = [
        Category(name="Grooming", category_type="Service"),
        Category(name="Veterinary", category_type="Service"),
    ]

    db.session.add_all(product_categories + service_categories)
    db.session.commit()

    print("Creating products...")

    products = []
    for i in range(6):
        product = Product(
            name=fake.word().capitalize() + " Pet Item",
            description=fake.text(max_nb_chars=100),
            image_url="https://via.placeholder.com/300",
            price=randint(500, 5000),
            stock_quantity=randint(1, 20),
            category_id=choice(product_categories).id
        )
        products.append(product)

    db.session.add_all(products)
    db.session.commit()

    # Inventory alerts
    for product in products:
        alert = InventoryAlert(
            product_id=product.id,
            threshold=5
        )
        db.session.add(alert)

    db.session.commit()
    print("Creating services...")

    services = []
    for i in range(4):
        service = Service(
            name=fake.word().capitalize() + " Service",
            description=fake.text(max_nb_chars=120),
            image_url="https://via.placeholder.com/300",
            base_price=randint(1000, 8000),
            category_id=choice(service_categories).id
        )
        services.append(service)

    db.session.add_all(services)
    db.session.commit()

    print("Creating delivery zones...")

    zones = [
        DeliveryZone(zone_name="CBD", delivery_fee=200),
        DeliveryZone(zone_name="Westlands", delivery_fee=300),
        DeliveryZone(zone_name="Karen", delivery_fee=500),
    ]

    db.session.add_all(zones)
    db.session.commit()

    print("Creating carts...")

    for user in users:
        cart = Cart(user_id=user.id)
        db.session.add(cart)
        db.session.commit()

        # Add cart items
        for _ in range(2):
            product = choice(products)
            item = CartItem(
                cart_id=cart.id,
                product_id=product.id,
                quantity=randint(1, 3)
            )
            db.session.add(item)

    db.session.commit()
    print("Creating orders...")

    orders = []

    for user in users:
        order = Order(
            user_id=user.id,
            delivery_zone_id=choice(zones).id,
            status=choice(["Pending", "Approved", "Paid"]),
            exact_location="Nairobi, Kenya"
        )
        db.session.add(order)
        db.session.commit()

        # Order items
        for _ in range(2):
            product = choice(products)
            item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=randint(1, 3),
                unit_price=product.price
            )
            db.session.add(item)

        db.session.commit()

        # Order history
        history = OrderStatusHistory(
            order_id=order.id,
            status=order.status
        )
        db.session.add(history)

        orders.append(order)

    db.session.commit()

    # ---------------------------------------------------
    # APPOINTMENTS
    # ---------------------------------------------------
    print("Creating appointments...")

    appointments = []

    for user in users:
        service = choice(services)
        appointment = Appointment(
            user_id=user.id,
            service_id=service.id,
            appointment_date=datetime.now() + timedelta(days=randint(1, 10)),
            status=choice(["Scheduled", "Approved", "Completed"]),
            notes="Routine service",
            total_price=service.base_price,
            delivery_zone_id=choice(zones).id,
            exact_location="Customer home"
        )
        db.session.add(appointment)
        appointments.append(appointment)

    db.session.commit()

    print("💳 Creating payments...")

    for order in orders:
        payment = Payment(
            user_id=order.user_id,
            order_id=order.id,
            payment_method="Cash",
            amount=order.total_amount,
            status="success"
        )
        db.session.add(payment)

    for appointment in appointments:
        payment = Payment(
            user_id=appointment.user_id,
            appointment_id=appointment.id,
            payment_method="M-Pesa",
            amount=appointment.total_price,
            status="completed",
            checkout_request_id=fake.uuid4(),
            mpesa_receipt_number=fake.uuid4()
        )
        db.session.add(payment)

    db.session.commit()

    print("Creating reviews...")

    for _ in range(5):
        review = Review(
            user_id=choice(users).id,
            product_id=choice(products).id,
            rating=randint(3, 5),
            comment=fake.sentence()
        )
        db.session.add(review)

    for _ in range(5):
        review = Review(
            user_id=choice(users).id,
            service_id=choice(services).id,
            rating=randint(3, 5),
            comment=fake.sentence()
        )
        db.session.add(review)

    db.session.commit()

    print("Database seeded successfully!")


if __name__ == "__main__":
    with app.app_context():
        seed()
