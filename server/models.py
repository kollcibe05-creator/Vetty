from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func

from config import db, bcrypt

class Product(db.model, SerializerMixin):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    price = db.Column(db.Integer)
    stock_quantity = db.Column(db.Integer)
    category_id = db.colum(db.Integer, db.ForeignKey("categories.id") )


class Service(db.model, SerializerMixin):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    base_price = db.Column(db.Integer)
    category_id = db.colum(db.Integer, db.ForeignKey("categories.id") )

class Review(db.model, SerializerMixin):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text)
    rating = db.Column(db.Integer)
    user_id = db.colum(db.Integer, db.ForeignKey("users.id") )

    #Need resolution
    product_id = db.colum(db.Integer, db.ForeignKey("products.id") )
    service_id = db.colum(db.Integer, db.ForeignKey("services.id") )
    
    review_type = db.Column( db.String)
    reviewed_id = db.Column(db.Integer)
    category_id = db.colum(db.Integer, db.ForeignKey("categories.id") )
    ###

class Category(db.model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Integer, nullable=False)
    category_type = db.Column(db.String)
