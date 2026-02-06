<<<<<<< HEAD
from config import db, bcrypt, app
from models import (
    User, Role, Product, Service, Category, 
    Cart, CartItem, Order, OrderItem, Payment, 
    Review, InventoryAlert, DeliveryZone, 
    OrderStatusHistory, Appointment
)
from datetime import datetime, timedelta
import random

def seed_roles():
    """Create basic roles"""
    roles = [
        Role(name="Customer"),
        Role(name="Admin")
    ]
    
    for role in roles:
        existing = Role.query.filter_by(name=role.name).first()
        if not existing:
            db.session.add(role)
    
    db.session.commit()
    print("✅ Roles seeded")

def seed_users():
    """Create demo users"""
    admin_role = Role.query.filter_by(name="Admin").first()
    customer_role = Role.query.filter_by(name="Customer").first()
    
    users = [
        {
            "username": "admin",
            "email": "admin@vetty.com",
            "password": "admin123",
            "role": admin_role
        },
        {
            "username": "john_doe",
            "email": "john@example.com",
            "password": "password123",
            "role": customer_role
        },
        {
            "username": "jane_smith",
            "email": "jane@example.com", 
            "password": "password123",
            "role": customer_role
        }
    ]
    
    for user_data in users:
        existing = User.query.filter_by(email=user_data["email"]).first()
        if not existing:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                role=user_data["role"]
            )
            user.password_hash = bcrypt.generate_password_hash(user_data["password"]).decode('utf-8')
            db.session.add(user)
    
    db.session.commit()
    print("✅ Users seeded")

def seed_categories():
    """Create product and service categories"""
    categories = [
        Category(name="Pet Food", description="Nutritional products for pets"),
        Category(name="Accessories", description="Pet accessories and toys"),
        Category(name="Grooming", description="Pet grooming supplies"),
        Category(name="Health", description="Health and wellness products"),
        Category(name="Training", description="Pet training services"),
        Category(name="Exercise", description="Exercise and walking services"),
        Category(name="Veterinary", description="Veterinary services"),
    ]
    
    for category in categories:
        existing = Category.query.filter_by(name=category.name).first()
        if not existing:
            db.session.add(category)
    
    db.session.commit()
    print("✅ Categories seeded")

def seed_products():
    """Create demo products"""
    food_category = Category.query.filter_by(name="Pet Food").first()
    accessories_category = Category.query.filter_by(name="Accessories").first()
    grooming_category = Category.query.filter_by(name="Grooming").first()
    
    products = [
        {
            "name": "Premium Dog Food",
            "description": "High-quality dog food with essential nutrients for adult dogs",
            "price": 45.99,
            "stock_quantity": 50,
            "category": food_category
        },
        {
            "name": "Cat Food Premium",
            "description": "Nutritious cat food for all life stages",
            "price": 35.99,
            "stock_quantity": 30,
            "category": food_category
        },
        {
            "name": "Pet Carrier",
            "description": "Comfortable and secure pet carrier for travel",
            "price": 29.99,
            "stock_quantity": 15,
            "category": accessories_category
        },
        {
            "name": "Grooming Kit",
            "description": "Complete grooming kit for dogs and cats",
            "price": 25.99,
            "stock_quantity": 25,
            "category": grooming_category
        },
        {
            "name": "Pet Toys Set",
            "description": "Interactive toys for pets",
            "price": 15.99,
            "stock_quantity": 40,
            "category": accessories_category
        }
    ]
    
    for product_data in products:
        existing = Product.query.filter_by(name=product_data["name"]).first()
        if not existing:
            product = Product(
                name=product_data["name"],
                description=product_data["description"],
                price=product_data["price"],
                stock_quantity=product_data["stock_quantity"],
                category=product_data["category"]
            )
            db.session.add(product)
    
    db.session.commit()
    print("✅ Products seeded")

def seed_services():
    """Create demo services"""
    training_category = Category.query.filter_by(name="Training").first()
    exercise_category = Category.query.filter_by(name="Exercise").first()
    veterinary_category = Category.query.filter_by(name="Veterinary").first()
    
    services = [
        {
            "name": "Pet Training",
            "description": "Professional training services for dogs of all ages",
            "price": 45.00,
            "duration": 60,
            "category": training_category
        },
        {
            "name": "Pet Walking",
            "description": "Daily walking service for dogs",
            "price": 25.00,
            "duration": 30,
            "category": exercise_category
        },
        {
            "name": "Grooming Service",
            "description": "Full grooming service including bath and haircut",
            "price": 35.00,
            "duration": 90,
            "category": grooming_category
        },
        {
            "name": "Veterinary Checkup",
            "description": "Complete health examination",
            "price": 75.00,
            "duration": 45,
            "category": veterinary_category
        }
    ]
    
    for service_data in services:
        existing = Service.query.filter_by(name=service_data["name"]).first()
        if not existing:
            service = Service(
                name=service_data["name"],
                description=service_data["description"],
                price=service_data["price"],
                duration=service_data["duration"],
                category=service_data["category"]
            )
            db.session.add(service)
    
    db.session.commit()
    print("✅ Services seeded")

def seed_inventory_alerts():
    """Create inventory alerts for products"""
    products = Product.query.all()
    
    for product in products[:3]:  # Create alerts for first 3 products
        existing = InventoryAlert.query.filter_by(product_id=product.id).first()
        if not existing:
            alert = InventoryAlert(
                product_id=product.id,
                threshold=random.randint(5, 15)
            )
            db.session.add(alert)
    
    db.session.commit()
    print("✅ Inventory alerts seeded")

def seed_delivery_zones():
    """Create delivery zones"""
    zones = [
        {"zone_name": "Downtown", "delivery_fee": 100},
        {"zone_name": "Uptown", "delivery_fee": 150},
        {"zone_name": "Suburbs", "delivery_fee": 200},
        {"zone_name": "Airport Area", "delivery_fee": 250}
    ]
    
    for zone_data in zones:
        existing = DeliveryZone.query.filter_by(zone_name=zone_data["zone_name"]).first()
        if not existing:
            zone = DeliveryZone(
                zone_name=zone_data["zone_name"],
                delivery_fee=zone_data["delivery_fee"]
            )
            db.session.add(zone)
    
    db.session.commit()
    print("✅ Delivery zones seeded")

def seed_reviews():
    """Create demo reviews"""
    products = Product.query.all()
    services = Service.query.all()
    users = User.query.filter(User.role.has(name="Customer")).all()
    
    if not users:
        print("⚠️ No users found for reviews")
        return
    
    # Create product reviews
    for product in products[:2]:
        for user in users[:2]:
            existing = Review.query.filter_by(
                product_id=product.id, 
                user_id=user.id
            ).first()
            if not existing:
                review = Review(
                    rating=random.randint(4, 5),
                    comment=f"Great product! Very satisfied with the {product.name.lower()}.",
                    product_id=product.id,
                    user_id=user.id
                )
                db.session.add(review)
    
    # Create service reviews
    for service in services[:2]:
        for user in users[:2]:
            existing = Review.query.filter_by(
                service_id=service.id,
                user_id=user.id
            ).first()
            if not existing:
                review = Review(
                    rating=random.randint(4, 5),
                    comment=f"Excellent service! The {service.name.lower()} was professional and thorough.",
                    service_id=service.id,
                    user_id=user.id
                )
                db.session.add(review)
    
    db.session.commit()
    print("✅ Reviews seeded")

def seed_all():
    """Seed all data"""
    print("🌱 Starting database seeding...")
    
    try:
        with app.app_context():
            seed_roles()
            seed_users()
            seed_categories()
            seed_products()
            seed_services()
            seed_inventory_alerts()
            seed_delivery_zones()
            seed_reviews()
            
            print("🎉 Database seeding completed successfully!")
            print("\n📊 Summary:")
            print(f"   Roles: {Role.query.count()}")
            print(f"   Users: {User.query.count()}")
            print(f"   Categories: {Category.query.count()}")
            print(f"   Products: {Product.query.count()}")
            print(f"   Services: {Service.query.count()}")
            print(f"   Reviews: {Review.query.count()}")
            print(f"   Inventory Alerts: {InventoryAlert.query.count()}")
            print(f"   Delivery Zones: {DeliveryZone.query.count()}")
            
            print("\n🔑 Login credentials:")
            print("   Admin: admin@vetty.com / admin123")
            print("   Customer: john@example.com / password123")
            print("   Customer: jane@example.com / password123")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        raise

if __name__ == "__main__":
    seed_all()
=======
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
>>>>>>> origin/dev
