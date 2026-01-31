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
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))  # Link to category


class Service(db.Model, SerializerMixin):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    base_price = db.Column(db.Integer)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))  # Link to category


class Review(db.Model, SerializerMixin):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text)
    rating = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    # Map review to product or service
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"))

    review_type = db.Column(db.String)  # Type of review: product/service
    reviewed_id = db.Column(db.Integer)  # ID of reviewed item
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))  # Optional category link


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category_type = db.Column(db.String)  # E.g., product/service category


# Admin: delivery zones for Vetty orders
class DeliveryZone(db.Model, SerializerMixin):
    __tablename__ = "delivery_zones"

    id = db.Column(db.Integer, primary_key=True)
    zone_name = db.Column(db.String, nullable=False)  # Zone name
    delivery_fee = db.Column(db.Integer, nullable=False)  # Fee per zone


# Admin: inventory alerts for low-stock items
class InventoryAlert(db.Model, SerializerMixin):
    __tablename__ = "inventory_alerts"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))  # Product monitored
    threshold = db.Column(db.Integer, nullable=False)  # Stock threshold
