#!/usr/bin/env python3
"""
Minimal Vetty Database Seeding Script
"""

import sys
import os
from datetime import datetime, timedelta
from app import app, db
from models import (
    User, Role, Product, Category, Cart, CartItem, 
    Order, OrderItem, Payment
)

def main():
    with app.app_context():
        print("🌱 Starting Vetty Database Seeding...")
        print("==================================================")
        
        # Create tables first
        print("🏗️ Creating database tables...")
        db.create_all()
        print("✅ Database tables created")
        
        # Seed roles
        print("🎭 Seeding roles...")
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
        
        # Seed sellers
        print("🏪 Seeding sellers...")
        admin_role = Role.query.filter_by(name='Admin').first()
        
        seller1 = User.query.filter_by(email='seller1@vetty.com').first()
        if not seller1:
            seller1 = User(
                username='vetcare_plus',
                email='seller1@vetty.com',
                password='seller123456',
                role=admin_role,
                business_name='VetCare Plus Veterinary Supplies',
                business_description='Premium veterinary supplies and equipment for professional practices'
            )
            db.session.add(seller1)
        
        seller2 = User.query.filter_by(email='seller2@vetty.com').first()
        if not seller2:
            seller2 = User(
                username='pet_paradise',
                email='seller2@vetty.com',
                password='seller123456',
                role=admin_role,
                business_name='Pet Paradise Veterinary Clinic',
                business_description='Full-service veterinary clinic with grooming and boarding services'
            )
            db.session.add(seller2)
        
        db.session.commit()
        print("✅ Created 2 seller accounts")
        
        # Seed buyers
        print("🛍️ Seeding buyers...")
        customer_role = Role.query.filter_by(name='Customer').first()
        
        buyer1 = User.query.filter_by(email='buyer1@vetty.com').first()
        if not buyer1:
            buyer1 = User(
                username='pet_parent1',
                email='buyer1@vetty.com',
                password='buyer123456',
                role=customer_role
            )
            db.session.add(buyer1)
        # Create cart for buyer1
        cart1 = Cart()
        buyer1.carts = cart1
        db.session.add(cart1)
    
        buyer2 = User.query.filter_by(email='buyer2@vetty.com').first()
        if not buyer2:
            buyer2 = User(
                username='pet_parent2',
                email='buyer2@vetty.com',
                password='buyer123456',
                role=customer_role
            )
            db.session.add(buyer2)
        # Create cart for buyer2
        cart2 = Cart()
        buyer2.carts = cart2
        db.session.add(cart2)
    
        db.session.commit()
        print("✅ Created 2 buyer accounts with carts")
        
        # Seed categories
        print("📂 Seeding categories...")
        categories = [
            {'name': 'Dog Food', 'category_type': 'Product'},
            {'name': 'Cat Food', 'category_type': 'Product'},
            {'name': 'Pet Supplies', 'category_type': 'Product'},
            {'name': 'Pet Medicine', 'category_type': 'Product'},
            {'name': 'Pet Toys', 'category_type': 'Product'},
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
        
        # Seed products
        print("🛍️ Seeding products...")
        food_cat = Category.query.filter_by(name='Dog Food').first()
        supplies_cat = Category.query.filter_by(name='Pet Supplies').first()
        medicine_cat = Category.query.filter_by(name='Pet Medicine').first()
        toys_cat = Category.query.filter_by(name='Pet Toys').first()
        
        products = [
            {
                'name': 'Premium Adult Dog Food',
                'description': 'High-quality dog food with real chicken and essential nutrients',
                'price': 4599,
                'stock_quantity': 100,
                'image_url': 'https://images.unsplash.com/photo-1583339292488-5f6a9c9d9a?w=400',
                'category': food_cat
            },
            {
                'name': 'Orthopedic Dog Bed',
                'description': 'Premium orthopedic dog bed with memory foam',
                'price': 8999,
                'stock_quantity': 25,
                'image_url': 'https://images.unsplash.com/photo-1559210626173-6f9c8a4c9a?w=400',
                'category': supplies_cat
            },
            {
                'name': 'Flea & Tick Prevention',
                'description': 'Veterinary-recommended flea and tick prevention',
                'price': 5499,
                'stock_quantity': 40,
                'image_url': 'https://images.unsplash.com/photo-1599460570128-cd36c0e5f6d?w=400',
                'category': medicine_cat
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
                    category=product_data['category']
                )
                db.session.add(product)
    
        db.session.commit()
        print("✅ Created 3 sample products")
        
        # Seed orders
        print("📦 Seeding orders...")
        buyer1 = User.query.filter_by(email='buyer1@vetty.com').first()
        product1 = Product.query.filter_by(name='Premium Adult Dog Food').first()
        product2 = Product.query.filter_by(name='Orthopedic Dog Bed').first()
        
        orders = [
            {
                'user': buyer1,
                'status': 'Pending',
                'items': [
                    {
                        'product': product1,
                        'quantity': 2,
                        'unit_price': product1.price
                    }
                ]
            },
            {
                'user': buyer1,
                'status': 'Pending',
                'items': [
                    {
                        'product': product2,
                        'quantity': 1,
                        'unit_price': product2.price
                    }
                ]
            },
            {
                'user': buyer1,
                'status': 'Pending',
                'items': [
                    {
                        'product': product1,
                        'quantity': 1,
                        'unit_price': product1.price
                    }
                ]
            }
        ]
        
        for order_data in orders:
            order = Order(
                user=order_data['user'],
                status=order_data['status']
            )
            db.session.add(order)
            db.session.flush()
            
            # Add order items
            for item_data in order_data['items']:
                order_item = OrderItem(
                    order=order,
                    product=item_data['product'],
                    quantity=item_data['quantity'],
                    unit_price=item_data['unit_price']
                )
                db.session.add(order_item)
    
        db.session.commit()
        print("✅ Created 3 sample orders")
        
        print("==================================================")
        print("🎉 Database seeding completed successfully!")
        
        print("\n📋 Test Accounts:")
        print("🔹 Seller 1: seller1@vetty.com / seller123456")
        print("🔹 Seller 2: seller2@vetty.com / seller123456")
        print("🔹 Buyer 1: buyer1@vetty.com / buyer123456")
        print("🔹 Buyer 2: buyer2@vetty.com / buyer123456")

if __name__ == '__main__':
    main()
