from sqlalchemy import true
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func

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


class Service(db.Model, SerializerMixin):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    base_price = db.Column(db.Integer)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))


class Review(db.Model, SerializerMixin):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text)
    rating = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    #Need resolution
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"))

    review_type = db.Column(db.String)
    reviewed_id = db.Column(db.Integer)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))
    ###


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category_type = db.Column(db.String)


class DeliveryZone(db.Model, SerializerMixin):
    __tablename__ = "delivery_zones"

    id = db.Column(db.Integer, primary_key=True)
    zone_name = db.Column(db.String, nullable=False)
    delivery_fee = db.Column(db.Integer, nullable=False)


class InventoryAlert(db.Model, SerializerMixin):
    __tablename__ = "inventory_alerts"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    threshold = db.Column(db.Integer, nullable=False)

class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    total_amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

class Order_Item(db.Model, SerializerMixin):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"))
    quantity = db.Column(db.Integer, default=1)
    subtotal = db.Column(db.Float, nullable=False)

class Payment(db.Model, SerializerMixin):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
    payment_method = db.Column(db.String, nullable=False)
    #mpeasa specific fields
    checkout_request_id = db.Column(db.String, unique=True, nullable=True)#from daraja API
    merchant_request_id = db.Column(db.String, nullable=True)
    phone_number = db.Column(db.String, nullable=True)#the number that payed
    amount = db.Column(db.Float, nullable=False)
    mpesa_receipt_number = db.Column(db.String, unique=True, nullable=True)#recieved from callbak
    status = db.Column(db.String, default="Pending")#pending ,success, failed
    payment_date = db.Column(db.DateTime(timezone=True), server_default=func.now())

class Cart(db.Model, SerializerMixin):
    __tablename__ = "carts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    
    cart_items = db.relationship("CartItem", backref="cart", cascade="all, delete-orphan")

class CartItem(db.Model, SerializerMixin):
    __tablename__ = "cart_items"

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey("carts.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=True)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=True)
    quantity = db.Column(db.Integer, default=1)

