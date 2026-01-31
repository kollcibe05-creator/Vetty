from sqlalchemy import true
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt


class Product(db.Model, SerializerMixin):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    price = db.Column(db.Integer)
    stock_quantity = db.Column(db.Integer)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))

    reviews = db.relationship("Review", back_populates="product", cascade="all, delete-orphan")
    category = db.relationship("Category", back_populates="products")
    inventory_alerts = db.relationship("InventoryAlert", back_populates="product", cascade="all, delete-orphan")
    cart_items = db.relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    order_items = db.relationship("Order_Item", back_populates="product", cascade="all, delete-orphan")
    
    # #association_proxy#############################
    # inventory_alert_obj = db.relationship("InventoryAlert", back_populates="product", cascade="all, delete-orphan", useList=False)
    # #getting category name
    # category_name = association_proxy("category", "name")

    # #Get/set threshhold value directly
    # threshhold = association_proxy(
    #     "inventory_alert_obj",
    #     "threshhold",
    #     creator=lambda value: InventoryAlert(threshhold=value)

    # )




    serialize_rules = ("-reviews.product", "categories.products", "-inventory_alerts.product", "-cart_items.product", "order_items.product",)  #"-inventory_alert_obj", "-category_name", "threshold"


class Service(db.Model, SerializerMixin):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    base_price = db.Column(db.Integer)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))

    reviews = db.relationship("Review", back_populates="service", cascade="all, delete-orphan")
    user = db.relationship("User", back_populates="services")
    category = db.relationship("Category", back_populates="services")
    appointments = db.relationship("Appointment", back_populates="service", )

    serialize_rules=( "-reviews.user", "-user.services", "-category.services", "-appointments.service",)
class Review(db.Model, SerializerMixin):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text)
    rating = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    #can  either of them be null 
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=True)

    user = db.relationship("User", back_populates="reviews")

    product = db.relationship("Product", back_populates="reviews")

    service = db.relationship("Service", back_populates="reviews")

    serialize_rules = ("-user.reviews", "-product.reviews", "-service.reviews", )
    
    @validates("rating")
    def validate_rating(self, key,value):
        if not 1 <= value <=5:
            raise ValueError("Rating must be between 1 and 5")
        return value
    @validates("product_id", "service_id") 
    def validate_return_value_of_the_two(self, key, value ):
        return value


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category_type = db.Column(db.String, nullable=False)

    products = db.relationship("Product", back_populates="category")
    services = db.relationship("Service", back_populates="category")

    serialize_rules = ("-products.category", "-services.category",)

    @validates("category_type")
    def validate_category(self,key,value):
        if value not in ["Product", "Service"]:
            raise ValueError("Category_type can either be a Product or Service")
        return value
    

class DeliveryZone(db.Model, SerializerMixin):
    __tablename__ = "delivery_zones"

    id = db.Column(db.Integer, primary_key=True)
    zone_name = db.Column(db.String, nullable=False)
    delivery_fee = db.Column(db.Integer, nullable=False)

    orders = db.relationship("Order", back_populates="delivery_zone")

    serialize_rules = ("-orders.delivery_zone",)


class InventoryAlert(db.Model, SerializerMixin):
    __tablename__ = "inventory_alerts"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    threshold = db.Column(db.Integer, nullable=False)
    



class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return f"<Role '{self.name}'>"


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

   
    vetting_status = db.Column(
        db.String(20),
        default='not_started',
        nullable=False
    )  
    def set_password(self, password):
        from flask_bcrypt import Bcrypt
        bcrypt = Bcrypt()
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        from flask_bcrypt import Bcrypt
        bcrypt = Bcrypt()
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User '{self.username}' - {self.role.name if self.role else 'no role'}>"
