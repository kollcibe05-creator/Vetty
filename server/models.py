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

    product = db.relationship("Product", back_populates="inventory_alerts")


    serialize_rules = ("inventory_alerts.product")


class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    delivery_zone_id = db.Column(db.Integer, db.ForeignKey("delivery_zones.id"))
    total_amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    #relationships
    order_items = db.relationship("Order_Item", backref="order", cascade="all, delete-orphan")
    history = db.relationship("OrderStatusHistory", backref="order", cascade="all, delete-orphan")
    payment = db.relationship("Payment", backref="order", uselist=False)

    serialize_rules = ("-user.orders", "-order_items.order", "-history.order", "-payment.order",)


class Order_Item(db.Model, SerializerMixin):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    quantity = db.Column(db.Integer, default=1)
    subtotal = db.Column(db.Float, nullable=False)

    serialize_rules = ("-order.order_items", "-product.order_items", "-service.order_items",)

    @validates("product_id", "service_id")
    def validate_product_or_service(self, key, value):
        if key == "product_id" and self.service_id and value:
                raise ValueError("OrderItem can have either product or a service, not both")
        elif key == "service_id" and self.product_id and value:
                raise ValueError("OrderItem Cannot have both product and a service")
        return value

class Payment(db.Model, SerializerMixin):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey("appointments.id"), nullable=True)
    payment_method = db.Column(db.String, nullable=False)
    #mpeasa specific fields
    checkout_request_id = db.Column(db.String, unique=True, nullable=True)#from daraja API
    merchant_request_id = db.Column(db.String, nullable=True)
    phone_number = db.Column(db.String, nullable=True)#the number that payed
    amount = db.Column(db.Float, nullable=False)
    mpesa_receipt_number = db.Column(db.String, unique=True, nullable=True)#recieved from callbak
    status = db.Column(db.String, default="Pending")#pending ,success, failed
    payment_date = db.Column(db.DateTime(timezone=True), server_default=func.now())


    serialize_rules = ("-order.payment",)

    @validates('payment_method')
    def validate_method(self, key, method):
        allowed = ['M-Pesa', 'Cash']
        if method not in allowed:
            raise ValueError(f"Method must be one of {allowed}")
        return method
    
class Cart(db.Model, SerializerMixin):
    __tablename__ = "carts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    
    cart_items = db.relationship("CartItem", backref="cart", cascade="all, delete-orphan")

    ##association proxy
    products = association_proxy(
        "cart_items",
        "product",
        creator=lambda productObj: CartItem(product=productObj)
    )

    serialize_rules = ("-cart_items.cart")

class CartItem(db.Model, SerializerMixin):
    __tablename__ = "cart_items"

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey("carts.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=True)
    quantity = db.Column(db.Integer, default=1)

    serialize_rules = ("-cart.cart_items", "-product.cart_items", "-service.cart_items",)

    @validates("quantity")
    def validate_quantity(self, key, value):
        if value <= 0:
            raise ValueError("Quantity must be Greater than zero.")
        return value

class Appointment(db.Model, SerializerMixin):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String, default="Scheduled")
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

#serializin rules:avoid loops by excluding backrefs
    serialize_rules = ("-user.appointments", "-service.appointments",)


class OrderStatusHistory(db.Model, SerializerMixin):
    __tablename__ = "order_status_history"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    status = db.Column(db.String, nullable=False)
    changed_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
   
    serialize_rules = ("-order.history",)