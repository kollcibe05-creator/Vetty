#!/usr/bin/env python3
"""
Vetty Database Seeding Script
Populates the database with realistic veterinary/pet marketplace data
"""

import sys
from datetime import datetime, timedelta
from app import app, db
from models import (
    User, Role, Product, Category, Cart, CartItem,
    Order, OrderItem, Appointment, Service
)


def seed_roles():
    print("🎭 Seeding roles...")

    admin = Role.query.filter_by(name="Admin").first()
    customer = Role.query.filter_by(name="Customer").first()

    if not admin:
        admin = Role(name="Admin")
        customer = Role(name="Customer")
        db.session.add_all([admin, customer])
        db.session.commit()
        print("✅ Created Admin and Customer roles")
    else:
        print("✅ Roles already exist")



def seed_sellers():
    print("🏪 Seeding sellers...")

    admin_role = Role.query.filter_by(name="Admin").first()

    sellers = [
        {
            "username": "vetcare_plus",
            "email": "seller1@vetty.com",
            "password": "seller123456",
            "business_name": "VetCare Plus Veterinary Supplies",
            "business_description": "Premium veterinary supplies and equipment",
        },
        {
            "username": "pet_paradise",
            "email": "seller2@vetty.com",
            "password": "seller123456",
            "business_name": "Pet Paradise Store",
            "business_description": "Your one-stop pet store",
        },
    ]

    for data in sellers:
        if not User.query.filter_by(email=data["email"]).first():
            user = User(
                username=data["username"],
                email=data["email"],
                role=admin_role,
                business_name=data["business_name"],
                business_description=data["business_description"],
                vetting_status="approved",
            )
            user.password = data["password"]
            db.session.add(user)

    db.session.commit()
    print("✅ Sellers ready")



def seed_buyers():
    print("🛍️ Seeding buyers...")

    customer_role = Role.query.filter_by(name="Customer").first()

    buyers = [
        ("john_doe", "buyer1@vetty.com"),
        ("jane_smith", "buyer2@vetty.com"),
    ]

    for username, email in buyers:
        if not User.query.filter_by(email=email).first():
            buyer = User(username=username, email=email, role=customer_role)
            buyer.password = "buyer123456"
            cart = Cart(user=buyer)
            db.session.add_all([buyer, cart])

    db.session.commit()
    print("✅ Buyers created")



def seed_categories():
    print("📂 Seeding categories...")

    categories = [
        ("Dog Food", "Product"),
        ("Cat Food", "Product"),
        ("Pet Medications", "Product"),
        ("Pet Toys", "Product"),
        ("Grooming Supplies", "Product"),
        ("Veterinary Services", "Service"),
        ("Pet Training", "Service"),
        ("Pet Boarding", "Service"),
    ]

    for name, ctype in categories:
        if not Category.query.filter_by(name=name).first():
            db.session.add(Category(name=name, category_type=ctype))

    db.session.commit()
    print("✅ Categories ready")


def seed_products():
    """Create realistic pet products"""
    print("🛍️ Seeding products...")

    # Get categories
    dog_food_category = Category.query.filter_by(name='Dog Food').first()
    cat_food_category = Category.query.filter_by(name='Cat Food').first()
    medicine_category = Category.query.filter_by(name='Pet Medications').first()
    toys_category = Category.query.filter_by(name='Pet Toys').first()
    grooming_category = Category.query.filter_by(name='Grooming Supplies').first()

    products = [
        {
            'name': 'Premium Adult Dog Food - Chicken & Rice',
            'description': 'High-quality dog food formulated for adult dogs with real chicken as the first ingredient. Contains essential vitamins and minerals for optimal health.',
            'price': 4599,
            'stock_quantity': 50,
            'image_url': 'https://images.unsplash.com/photo-1583337435048-2de5dc1a0a2b?w=400',
            'category': dog_food_category
        },
        {
            'name': 'Grain-Free Cat Food - Salmon',
            'description': 'Premium grain-free cat food made with wild-caught salmon. Perfect for cats with sensitive stomachs or food allergies.',
            'price': 3899,
            'stock_quantity': 35,
            'image_url': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
            'category': cat_food_category
        },
        {
            'name': 'Flea & Tick Prevention for Dogs',
            'description': 'Monthly topical treatment for prevention of fleas, ticks, and chewing lice. Safe for all dog breeds.',
            'price': 2499,
            'stock_quantity': 100,
            'image_url': 'https://images.unsplash.com/photo-1606195741688-c3c503705d5c?w=400',
            'category': medicine_category
        },
        {
            'name': 'Interactive Dog Puzzle Toy',
            'description': 'Mental stimulation toy that dispenses treats as your dog solves the puzzle. Reduces anxiety and boredom.',
            'price': 1899,
            'stock_quantity': 75,
            'image_url': 'https://images.unsplash.com/photo-1606984282382-57e2bfe56a47?w=400',
            'category': toys_category
        },
        {
            'name': 'Professional Dog Grooming Kit',
            'description': 'Complete grooming kit with scissors, brushes, nail clippers, and styling tools. Professional grade.',
            'price': 3299,
            'stock_quantity': 25,
            'image_url': 'https://images.unsplash.com/photo-1516734214044-2e5a8b0b5b3c?w=400',
            'category': grooming_category
        }
    ]

    for product_data in products:
        existing_product = Product.query.filter_by(name=product_data['name']).first()
        if not existing_product:
            product = Product(
                name=product_data['name'],
                description=product_data['description'],
                price=product_data['price'],
                stock_quantity=product_data['stock_quantity'],
                image_url=product_data['image_url'],
                category_id=product_data['category'].id
            )
            db.session.add(product)

    db.session.commit()
    print(f"✅ Created {len(products)} realistic products")



            
    


def seed_services():
    print("🏥 Seeding services...")

    vet = Category.query.filter_by(name="Veterinary Services").first()
    training = Category.query.filter_by(name="Pet Training").first()
    boarding = Category.query.filter_by(name="Pet Boarding").first()

    services = [
        ("General Health Checkup", 7500, vet),
        ("Dental Cleaning", 12000, vet),
        ("Basic Obedience Training", 25000, training),
        ("Pet Boarding (Daily)", 3500, boarding),
    ]

    for name, price, category in services:
        if not Service.query.filter_by(name=name).first():
            db.session.add(
                Service(
                    name=name,
                    base_price=price,
                    description=name,
                    category=category,
                )
            )

    db.session.commit()
    print("✅ Services created")


# ---------------- MAIN ----------------
def main():
    print("🌱 Starting Vetty Database Seeding...")
    print("=" * 50)

    with app.app_context():
        try:
            db.create_all()
            seed_roles()
            seed_sellers()
            seed_buyers()
            seed_categories()
            seed_products()
            seed_services()

            print("=" * 50)
            print("🎉 Database seeding completed successfully!")
            print("Seller: seller1@vetty.com / seller123456")
            print("Buyer: buyer1@vetty.com / buyer123456")

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error during seeding: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()
