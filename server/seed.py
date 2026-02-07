from datetime import datetime, timedelta
from app import app
from models import db, User, Role, Category, Product, Service, DeliveryZone, InventoryAlert, Order, OrderItem, Review, Appointment, Cart, CartItem, Payment, OrderStatusHistory
from config import bcrypt

def seed_data():
    print("Deleting existing data...")
    # Clear existing data in reverse order of dependencies
    db.session.query(OrderItem).delete()
    db.session.query(OrderStatusHistory).delete()
    db.session.query(Payment).delete()
    db.session.query(Order).delete()
    db.session.query(Appointment).delete()
    db.session.query(Review).delete()
    db.session.query(CartItem).delete()
    db.session.query(Cart).delete()
    db.session.query(InventoryAlert).delete()
    db.session.query(Product).delete()
    db.session.query(Service).delete()
    db.session.query(Category).delete()
    db.session.query(DeliveryZone).delete()
    db.session.query(User).delete()
    db.session.query(Role).delete()

    print("Creating Roles...")
    admin_role = Role(name="Admin")
    customer_role = Role(name="User")
    db.session.add_all([admin_role, customer_role])
    db.session.commit()

    print("Creating Categories...")
    cat_supplies = Category(name="Pet Supplies", category_type="Product")
    cat_food = Category(name="Pet Food", category_type="Product")
    cat_grooming = Category(name="Grooming", category_type="Service")
    cat_vet = Category(name="Veterinary", category_type="Service")
    db.session.add_all([cat_supplies, cat_food, cat_grooming, cat_vet])
    db.session.commit()

    print("Creating Delivery Zones...")
    zones = [
        DeliveryZone(zone_name="Downtown", delivery_fee=200),
        DeliveryZone(zone_name="Suburbs", delivery_fee=500),
        DeliveryZone(zone_name="Outer Rim", delivery_fee=1000),
    ]
    db.session.add_all(zones)

    print("Creating Users...")
    admin = User(
        username="admin_jane",
        email="admin@vetty.com",
        role_id=admin_role.id,
        vetting_status="approved"
    )
    admin.password = "admin123"

    customer1 = User(
        username="mike_petlover",
        email="mike@gmail.com",
        role_id=customer_role.id,
        vetting_status="approved"
    )
    customer1.password = "password123"

    db.session.add_all([admin, customer1])
    db.session.commit()

    print("Creating Products...")
    p1 = Product(
        name="Premium Kibble",
        description="High-protein dry food for active dogs.",
        image_url="https://images.unsplash.com/photo-1589924691106-073b697596cd?auto=format&fit=crop&q=80&w=400",
        price=2500,
        stock_quantity=50,
        category_id=cat_food.id
    )
    p2 = Product(
        name="Cat Squeaky Toy",
        description="Interactive mouse toy with organic catnip.",
        image_url="https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=400",
        price=450,
        stock_quantity=100,
        category_id=cat_supplies.id
    )
    db.session.add_all([p1, p2])
    db.session.commit()

    print("Creating Inventory Alerts...")
    alert1 = InventoryAlert(product_id=p1.id, threshold=10)
    db.session.add(alert1)

    print("Creating Services...")
    s1 = Service(
        name="Full Grooming Session",
        description="Includes bath, haircut, and nail trimming.",
        image_url="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400",
        base_price=3000,
        category_id=cat_grooming.id
    )
    db.session.add(s1)
    db.session.commit()

    print("Creating Reviews...")
    r1 = Review(
        comment="My dog loves this food!",
        rating=5,
        user_id=customer1.id,
        product_id=p1.id
    )
    r2 = Review(
        comment="Great grooming, very gentle.",
        rating=4,
        user_id=customer1.id,
        service_id=s1.id
    )
    db.session.add_all([r1, r2])

    print("Creating an Order...")
    order1 = Order(
        user_id=customer1.id,
        delivery_zone_id=zones[0].id,
        status="Pending"
    )
    db.session.add(order1)
    db.session.flush() # Get order ID

    item1 = OrderItem(
        order_id=order1.id,
        product_id=p1.id,
        quantity=2,
        unit_price=p1.price
    )
    db.session.add(item1)

    print("Creating an Appointment...")
    appt = Appointment(
        user_id=customer1.id,
        service_id=s1.id,
        appointment_date=datetime.now() + timedelta(days=2),
        status="Scheduled",
        total_price=s1.base_price
    )
    db.session.add(appt)
    
    db.session.commit()
    print("Seeding completed successfully!")

if __name__ == "__main__":
    with app.app_context():
        seed_data()