#!/usr/bin/env python3
"""
Vetty Database Seeding Script
Populates the database with realistic veterinary/pet marketplace data
"""

import sys
import os
from datetime import datetime, timedelta
from app import app, db
from models import (
    User, Role, Product, Category, Cart, CartItem, 
    Order, OrderItem, Appointment, Service, Payment
)

def seed_roles():
    """Create initial roles"""
    print("🎭 Seeding roles...")
    
    # Create tables first
    db.create_all()
    
    admin_role = Role.query.filter_by(name='Admin').first()
    customer_role = Role.query.filter_by(name='Customer').first()
    
    if not admin_role:
        admin_role = Role(name='Admin')
        customer_role = Role(name='Customer')
        db.session.add(admin_role)
        db.session.add(customer_role)
        db.session.commit()
        print("✅ Created Admin and Customer roles")
    else:
        print("✅ Roles already exist")

def seed_sellers():
    """Create test seller accounts"""
    print("🏪 Seeding sellers...")
    
    admin_role = Role.query.filter_by(name='Admin').first()
    
    sellers = [
        {
            'username': 'vetcare_plus',
            'email': 'seller1@vetty.com',
            'password': 'seller123456',
            'business_name': 'VetCare Plus Veterinary Supplies',
            'business_description': 'Premium veterinary supplies and equipment for professional practices'
        },
        {
            'username': 'pet_paradise',
            'email': 'seller2@vetty.com', 
            'password': 'seller123456',
            'business_name': 'Pet Paradise Store',
            'business_description': 'Your one-stop shop for pet food, toys, and accessories'
        }
    ]
    
    for seller_data in sellers:
        existing_user = User.query.filter_by(email=seller_data['email']).first()
        if not existing_user:
            seller = User(
                username=seller_data['username'],
                email=seller_data['email'],
                role=admin_role,
                business_name=seller_data['business_name'],
                business_description=seller_data['business_description'],
                vetting_status='approved'
            )
            seller.password = seller_data['password']
            db.session.add(seller)
    
    db.session.commit()
    print("✅ Created 2 seller accounts")

def seed_buyers():
    """Create test buyer accounts"""
    print("🛍️ Seeding buyers...")
    
    customer_role = Role.query.filter_by(name='Customer').first()
    
    buyers = [
        {
            'username': 'john_doe',
            'email': 'buyer1@vetty.com',
            'password': 'buyer123456'
        },
        {
            'username': 'jane_smith',
            'email': 'buyer2@vetty.com',
            'password': 'buyer123456'
        }
    ]
    
    for buyer_data in buyers:
        existing_user = User.query.filter_by(email=buyer_data['email']).first()
        if not existing_user:
            buyer = User(
                username=buyer_data['username'],
                email=buyer_data['email'],
                role=customer_role
            )
            buyer.password = buyer_data['password']
            db.session.add(buyer)
            # Create cart for buyer
            cart = Cart()
            buyer.carts = cart
            db.session.add(cart)
    
    db.session.commit()
    print("✅ Created 2 buyer accounts with carts")

def seed_categories():
    """Create product categories"""
    print("📂 Seeding categories...")
    
    categories = [
        {'name': 'Dog Food', 'category_type': 'Product'},
        {'name': 'Cat Food', 'category_type': 'Product'},
        {'name': 'Pet Medications', 'category_type': 'Product'},
        {'name': 'Pet Toys', 'category_type': 'Product'},
        {'name': 'Grooming Supplies', 'category_type': 'Product'},
        {'name': 'Veterinary Services', 'category_type': 'Service'},
        {'name': 'Pet Training', 'category_type': 'Service'},
        {'name': 'Pet Boarding', 'category_type': 'Service'}
    ]
    
    for cat_data in categories:
        existing_cat = Category.query.filter_by(name=cat_data['name']).first()
        if not existing_cat:
            category = Category(
                name=cat_data['name'],
                category_type=cat_data['category_type']
            )
            db.session.add(category)
    
    db.session.commit()
    print("✅ Created 8 categories")

def seed_products():
    """Create realistic pet products"""
    print("🛍️ Seeding products...")
    
    # Get categories
    food_category = Category.query.filter_by(name='Dog Food').first()
    supplies_category = Category.query.filter_by(name='Pet Supplies').first()
    medicine_category = Category.query.filter_by(name='Pet Medications').first()
    toys_category = Category.query.filter_by(name='Pet Toys').first()
    
    # Get sellers
    seller1 = User.query.filter_by(email='seller1@vetty.com').first()
    seller2 = User.query.filter_by(email='seller2@vetty.com').first()
    
    products = [
        {
            'name': 'Premium Adult Dog Food - Chicken & Rice',
            'description': 'High-quality dog food formulated for adult dogs with real chicken as the first ingredient. Contains essential vitamins and minerals for optimal health.',
            'price': 4599,  # $45.99
            'stock_quantity': 50,
            'image_url': 'https://images.unsplash.com/photo-1583337435048-2de5dc1a0a2b?w=400',
            'category_id': food_category.id,
            'seller_id': seller1.id
        },
        {
            'name': 'Grain-Free Cat Food - Salmon',
            'description': 'Premium grain-free cat food made with wild-caught salmon. Perfect for cats with sensitive stomachs or food allergies.',
            'price': 3899,  # $38.99
            'stock_quantity': 35,
            'image_url': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
            'category_id': food_category.id,
            'seller_id': seller1.id
        },
        {
            'name': 'Flea & Tick Prevention for Dogs',
            'description': 'Monthly topical treatment for prevention of fleas, ticks, and chewing lice. Safe for all dog breeds.',
            'price': 2499,  # $24.99
            'stock_quantity': 100,
            'image_url': 'https://images.unsplash.com/photo-1606195741688-c3c503705d5c?w=400',
            'category_id': medicine_category.id,
            'seller_id': seller2.id
        },
        {
            'name': 'Interactive Dog Puzzle Toy',
            'description': 'Mental stimulation toy that dispenses treats as your dog solves the puzzle. Reduces anxiety and boredom.',
            'price': 1899,  # $18.99
            'stock_quantity': 75,
            'image_url': 'https://images.unsplash.com/photo-1606984282382-57e2bfe56a47?w=400',
            'category_id': toys_category.id,
            'seller_id': seller2.id
        },
        {
            'name': 'Professional Dog Grooming Kit',
            'description': 'Complete grooming kit with scissors, brushes, nail clippers, and styling tools. Professional grade.',
            'price': 3299,  # $32.99
            'stock_quantity': 25,
            'image_url': 'https://images.unsplash.com/photo-1516734214044-2e5a8b0b5b3c?w=400',
            'category_id': grooming.id,
            'seller_id': seller1.id
        },
        {
            'name': 'Puppy Starter Food Formula',
            'description': 'Specially formulated for puppies up to 12 months. Supports healthy growth and development.',
            'price': 4299,  # $42.99
            'stock_quantity': 40,
            'image_url': 'https://images.unsplash.com/photo-1560809918-9dea6d5b5c5c?w=400',
            'stock_quantity': 60,
            'image_url': 'https://images.unsplash.com/photo-1606350980771-6e2b6c8c9a?w=400',
            'category': supplies_category,
            'seller': seller1
        },
        
        # Pet Medicine
        {
            'name': 'Flea & Tick Prevention for Dogs',
            'description': 'Veterinary-recommended flea and tick prevention treatment. Provides month-long protection against fleas, ticks, and mosquitoes. Safe for all dog breeds over 8 weeks old.',
            'price': 5499,  # $54.99 in cents
            'stock_quantity': 40,
            'image_url': 'https://images.unsplash.com/photo-1599460570128-cd36c0e5f6d?w=400',
            'category': medicine_category,
            'seller': seller2
        },
        {
            'name': 'Cat Dental Care Kit',
            'description': 'Complete dental care kit for cats including enzymatic toothpaste, finger brush, and dental treats. Helps prevent plaque buildup and maintains healthy gums and fresh breath.',
            'price': 2499,  # $24.99 in cents
            'stock_quantity': 75,
            'image_url': 'https://images.unsplash.com/photo-1606350980771-6e2b6c8c9a?w=400',
            'category': medicine_category,
            'seller': seller1
        },
        
        # Pet Toys
        {
            'name': 'Interactive Puzzle Toy for Dogs',
            'description': 'Mental stimulation puzzle toy that dispenses treats as your dog plays. Helps reduce anxiety and boredom while providing rewarding play. Non-toxic materials and dishwasher safe.',
            'price': 1899,  # $18.99 in cents
            'stock_quantity': 95,
            'image_url': 'https://images.unsplash.com/photo-1606350980771-6e2b6c8c9a?w=400',
            'category': toys_category,
            'seller': seller2
        },
        {
            'name': 'Cat Scratching Post with Perch',
            'description': 'Natural sisal cat scratching post with comfortable perch and hanging toy. Provides cats with appropriate scratching outlet while saving your furniture from damage.',
            'price': 4299,  # $42.99 in cents
            'stock_quantity': 55,
            'image_url': 'https://images.unsplash.com/photo-1606350980771-6e2b6c8c9a?w=400',
            'category': toys_category,
            'seller': seller1
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
                category=product_data['category'],
                seller=product_data['seller']
            )
            db.session.add(product)
    
    db.session.commit()
    print(f"✅ Created {len(products)} realistic products")

def seed_services():
    """Create veterinary services"""
    print("🏥 Seeding services...")
    
    vet_services = Category.query.filter_by(name='Veterinary Services').first()
    training = Category.query.filter_by(name='Pet Training').first()
    boarding = Category.query.filter_by(name='Pet Boarding').first()
    
    services = [
        {
            'name': 'General Health Checkup',
            'description': 'Comprehensive physical examination including vaccination review, weight check, and health assessment.',
            'base_price': 7500,  # $75.00
            'category_id': vet_services.id
        },
        {
            'name': 'Dental Cleaning',
            'description': 'Professional teeth cleaning and oral health examination for dogs and cats.',
            'base_price': 12000,  # $120.00
            'category_id': vet_services.id
        },
        {
            'name': 'Basic Obedience Training',
            'description': '6-week basic obedience training program for puppies and adult dogs.',
            'base_price': 25000,  # $250.00
            'category_id': training.id
        },
        {
            'name': 'Pet Boarding - Daily Rate',
            'description': 'Safe and comfortable boarding with daily exercise and feeding included.',
            'base_price': 3500,  # $35.00
            'category_id': boarding.id
        }
    ]
    
    for service_data in services:
        existing_service = Service.query.filter_by(name=service_data['name']).first()
        if not existing_service:
            service = Service(
                name=service_data['name'],
                description=service_data['description'],
                base_price=service_data['base_price'],
                category_id=service_data['category_id']
            )
            db.session.add(service)
    
    db.session.commit()
    print("✅ Created 4 veterinary services")

def seed_orders():
    """Create sample orders for testing"""
    print("📦 Seeding orders...")
    
    buyer1 = User.query.filter_by(email='buyer1@vetty.com').first()
    buyer2 = User.query.filter_by(email='buyer2@vetty.com').first()
    
    # Get some products
    product1 = Product.query.filter_by(name='Premium Adult Dog Food - Chicken & Rice').first()
    product2 = Product.query.filter_by(name='Grain-Free Cat Food - Salmon').first()
    
    orders = [
        {
            'user': buyer1,
            'status': 'Pending',
            'items': [
                {'product': product1, 'quantity': 2, 'unit_price': product1.price}
            ]
        },
        {
            'user': buyer2,
            'status': 'Delivered',
            'items': [
                {'product': product2, 'quantity': 1, 'unit_price': product2.price}
            ]
        }
    ]
    
    for order_data in orders:
        order = Order(
            user=order_data['user'],
            status=order_data['status']
        )
        db.session.add(order)
        db.session.flush()  # Get the order ID
        
        for item_data in order_data['items']:
            order_item = OrderItem(
                order=order,
                product=item_data['product'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price']
            )
            db.session.add(order_item)
    
    db.session.commit()
    print("✅ Created 2 sample orders")

def seed_appointments():
    """Create sample appointments"""
    print("📅 Seeding appointments...")
    
    buyer1 = User.query.filter_by(email='buyer1@vetty.com').first()
    buyer2 = User.query.filter_by(email='buyer2@vetty.com').first()
    
    service1 = Service.query.filter_by(name='General Health Checkup').first()
    service2 = Service.query.filter_by(name='Dental Cleaning').first()
    
    appointments = [
        {
            'user': buyer1,
            'service': service1,
            'appointment_date': datetime.now() + timedelta(days=2),
            'notes': 'Annual checkup for Max',
            'total_price': service1.base_price,
            'status': 'Scheduled'
        },
        {
            'user': buyer2,
            'service': service2,
            'appointment_date': datetime.now() + timedelta(days=5),
            'notes': 'Luna needs dental cleaning',
            'total_price': service2.base_price,
            'status': 'Scheduled'
        }
    ]
    
    for appt_data in appointments:
        appointment = Appointment(
            user=appt_data['user'],
            service=appt_data['service'],
            appointment_date=appt_data['appointment_date'],
            notes=appt_data['notes'],
            total_price=appt_data['total_price'],
            status=appt_data['status']
        )
        db.session.add(appointment)
    
    db.session.commit()
    print("✅ Created 2 sample appointments")

def main():
    """Main seeding function"""
    print("🌱 Starting Vetty Database Seeding...")
    print("=" * 50)
    
    with app.app_context():
        try:
            # Create tables first
            print("🏗️ Creating database tables...")
            db.create_all()
            print("✅ Database tables created")
            
            # Seed in order
            seed_roles()
            seed_sellers()
            seed_buyers()
            seed_categories()
            seed_products()
            seed_services()
            seed_orders()
            seed_appointments()
            
            print("=" * 50)
            print("🎉 Database seeding completed successfully!")
            print("\n📋 Test Accounts:")
            print("🔹 Seller 1: seller1@vetty.com / seller123456")
            print("🔹 Seller 2: seller2@vetty.com / seller123456")
            print("🔹 Buyer 1: buyer1@vetty.com / buyer123456")
            print("🔹 Buyer 2: buyer2@vetty.com / buyer123456")
            
        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            db.session.rollback()
            sys.exit(1)

if __name__ == '__main__':
    main()
