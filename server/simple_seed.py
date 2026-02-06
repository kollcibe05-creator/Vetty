#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import app, db, bcrypt
from models import (
    User, Role, Product, Service, Category, 
    Cart, CartItem, Order, OrderItem, Payment, 
    Review, InventoryAlert, DeliveryZone, 
    OrderStatusHistory, Appointment
)
from datetime import datetime, timedelta
import random

def main():
    print("🌱 Starting database seeding...")
    
    with app.app_context():
        # Drop and recreate all tables
        db.drop_all()
        db.create_all()
        print("✅ Database tables created")
        
        # Create roles
        admin_role = Role(name="Admin")
        customer_role = Role(name="Customer")
        db.session.add(admin_role)
        db.session.add(customer_role)
        db.session.commit()
        print("✅ Roles created")
        
        # Create users
        admin_user = User(
            username="admin",
            email="admin@vetty.com",
            role=admin_role
        )
        admin_user.password = "admin123"
        
        customer_user = User(
            username="john_doe",
            email="john@example.com",
            role=customer_role
        )
        customer_user.password = "password123"
        
        db.session.add(admin_user)
        db.session.add(customer_user)
        db.session.commit()
        print("✅ Users created")
        
        # Create categories
        categories = [
            Category(name="Pet Food", category_type="Product"),
            Category(name="Accessories", category_type="Product"),
            Category(name="Grooming", category_type="Service"),
            Category(name="Training", category_type="Service"),
            Category(name="Exercise", category_type="Service"),
            Category(name="Veterinary", category_type="Service"),
        ]
        
        for category in categories:
            db.session.add(category)
        db.session.commit()
        print("✅ Categories created")
        
        # Create products
        food_category = Category.query.filter_by(name="Pet Food").first()
        accessories_category = Category.query.filter_by(name="Accessories").first()
        grooming_category = Category.query.filter_by(name="Grooming").first()
        
        products = [
            Product(
                name="Premium Dog Food",
                description="High-quality dog food with essential nutrients for adult dogs",
                price=45.99,
                stock_quantity=50,
                category=food_category
            ),
            Product(
                name="Cat Food Premium",
                description="Nutritious cat food for all life stages",
                price=35.99,
                stock_quantity=30,
                category=food_category
            ),
            Product(
                name="Pet Carrier",
                description="Comfortable and secure pet carrier for travel",
                price=29.99,
                stock_quantity=15,
                category=accessories_category
            ),
            Product(
                name="Grooming Kit",
                description="Complete grooming kit for dogs and cats",
                price=25.99,
                stock_quantity=25,
                category=grooming_category
            ),
            Product(
                name="Pet Toys Set",
                description="Interactive toys for pets",
                price=15.99,
                stock_quantity=40,
                category=accessories_category
            )
        ]
        
        for product in products:
            db.session.add(product)
        db.session.commit()
        print("✅ Products created")
        
        # Create services
        training_category = Category.query.filter_by(name="Training").first()
        exercise_category = Category.query.filter_by(name="Exercise").first()
        veterinary_category = Category.query.filter_by(name="Veterinary").first()
        
        services = [
            Service(
                name="Pet Training",
                description="Professional training services for dogs of all ages",
                base_price=4500,  # $45.00 in cents
                category=training_category
            ),
            Service(
                name="Pet Walking",
                description="Daily walking service for dogs",
                base_price=2500,  # $25.00 in cents
                category=exercise_category
            ),
            Service(
                name="Grooming Service",
                description="Full grooming service including bath and haircut",
                base_price=3500,  # $35.00 in cents
                category=grooming_category
            ),
            Service(
                name="Veterinary Checkup",
                description="Complete health examination",
                base_price=7500,  # $75.00 in cents
                category=veterinary_category
            )
        ]
        
        for service in services:
            db.session.add(service)
        db.session.commit()
        print("✅ Services created")
        
        # Create delivery zones
        zones = [
            DeliveryZone(zone_name="Downtown", delivery_fee=100),
            DeliveryZone(zone_name="Uptown", delivery_fee=150),
            DeliveryZone(zone_name="Suburbs", delivery_fee=200),
            DeliveryZone(zone_name="Airport Area", delivery_fee=250)
        ]
        
        for zone in zones:
            db.session.add(zone)
        db.session.commit()
        print("✅ Delivery zones created")
        
        # Create inventory alerts
        for product in Product.query.limit(3).all():
            alert = InventoryAlert(
                product_id=product.id,
                threshold=random.randint(5, 15)
            )
            db.session.add(alert)
        
        db.session.commit()
        print("✅ Inventory alerts created")
        
        print("\n🎉 Database seeding completed successfully!")
        print("\n📊 Summary:")
        print(f"   Roles: {Role.query.count()}")
        print(f"   Users: {User.query.count()}")
        print(f"   Categories: {Category.query.count()}")
        print(f"   Products: {Product.query.count()}")
        print(f"   Services: {Service.query.count()}")
        print(f"   Inventory Alerts: {InventoryAlert.query.count()}")
        print(f"   Delivery Zones: {DeliveryZone.query.count()}")
        
        print("\n🔑 Login credentials:")
        print("   Admin: admin@vetty.com / admin123")
        print("   Customer: john@example.com / password123")

if __name__ == "__main__":
    main()
