#!/usr/bin/env python3

from datetime import datetime, timedelta
import random
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
    for _ in range(5):
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
    for _ in range(10):
        product = Product(
            name=f"{fake.word().capitalize()} Pet Item",
            description=fake.text(max_nb_chars=100),
            image_url="https://via.placeholder.com/300",
            price=random.randint(500, 5000),
            stock_quantity=random.randint(10, 50),
            category_id=random.choice(product_categories).id
        )
        products.append(product)
    db.session.add_all(products)
    db.session.commit()

    for product in products:
        alert = InventoryAlert(product_id=product.id, threshold=5)
        db.session.add(alert)
    db.session.commit()

    print("Creating services...")
    services = []
    for _ in range(4):
        service = Service(
            name=f"{fake.word().capitalize()} Service",
            description=fake.text(max_nb_chars=120),
            image_url="https://via.placeholder.com/300",
            base_price=random.randint(1000, 8000),
            category_id=random.choice(service_categories).id
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

        selected_products = random.sample(products, 2)
        for product in selected_products:
            item = CartItem(
                cart_id=cart.id,
                product_id=product.id,
                quantity=random.randint(1, 3)
            )
            db.session.add(item)
    db.session.commit()

    print("Creating orders...")
    orders = []
    for user in users:
        order = Order(
            user_id=user.id,
            delivery_zone_id=random.choice(zones).id,
            status=random.choice(["Pending", "Approved", "Paid"]),
            exact_location="Nairobi, Kenya"
        )
        db.session.add(order)
        db.session.commit()

        selected_products = random.sample(products, 2)
        for product in selected_products:
            item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=random.randint(1, 3),
                unit_price=product.price
            )
            db.session.add(item)
        
        db.session.add(OrderStatusHistory(order_id=order.id, status=order.status))
        orders.append(order)
    db.session.commit()

    print("Creating appointments...")
    appointments = []
    for user in users:
        service = random.choice(services)
        appt = Appointment(
            user_id=user.id,
            service_id=service.id,
            appointment_date=datetime.now() + timedelta(days=random.randint(1, 10)),
            status=random.choice(["Scheduled", "Approved", "Completed"]),
            notes="Routine service",
            total_price=service.base_price,
            delivery_zone_id=random.choice(zones).id,
            exact_location="Customer home"
        )
        db.session.add(appt)
        appointments.append(appt)
    db.session.commit()

    print("Creating payments...")
    for order in orders:
        payment = Payment(
            user_id=order.user_id,
            order_id=order.id,
            payment_method="Cash",
            amount=1000,
            status="success"
        )
        db.session.add(payment)

    for appt in appointments:
        payment = Payment(
            user_id=appt.user_id,
            appointment_id=appt.id,
            payment_method="M-Pesa",
            amount=appt.total_price,
            status="completed",
            checkout_request_id=fake.uuid4(),
            mpesa_receipt_number=fake.uuid4()
        )
        db.session.add(payment)
    db.session.commit()

    print("Creating reviews...")
    product_review_pairs = set()
    while len(product_review_pairs) < 5:
        u_id = random.choice(users).id
        p_id = random.choice(products).id
        if (u_id, p_id) not in product_review_pairs:
            review = Review(
                user_id=u_id, 
                product_id=p_id, 
                rating=random.randint(3, 5), 
                comment=fake.sentence()
            )
            db.session.add(review)
            product_review_pairs.add((u_id, p_id))

    db.session.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    with app.app_context():
        seed()