from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func
from sqlalchemy import event

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

    reviews = db.relationship("Review", back_populates="product", cascade="all, delete-orphan")
    category = db.relationship("Category", back_populates="products")
    inventory_alert = db.relationship("InventoryAlert", back_populates="product", uselist=False, cascade="all, delete-orphan")
    cart_items = db.relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    order_items = db.relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")
    
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




    # serialize_rules = ("-reviews.product", "-category.products", "-inventory_alert.product", "-cart_items.product", "-order_items.product", "-reviews", "-cart_items", "-order_items" )  #"-inventory_alert_obj", "-category_name", "threshold"
    serialize_rules = ("-reviews", "-category", "-inventory_alert", "-cart_items", "-order_items")


class Service(db.Model, SerializerMixin):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    base_price = db.Column(db.Integer)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))  # Link to category

    reviews = db.relationship("Review", back_populates="service", cascade="all, delete-orphan")
    category = db.relationship("Category", back_populates="services")
    appointments = db.relationship("Appointment", back_populates="service", )

    serialize_rules=( "-reviews", "-category.services", "-appointments",)
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

    serialize_rules = ("-user", "-product", "-service", )
    
    # @validates("rating")
    # def validate_rating(self, key,value):
    #     if not 1 <= value <=5:
    #         raise ValueError("Rating must be between 1 and 5")
    #     return value
    # @validates("product_id", "service_id") 
    # def validate_target(self, key, value):
    #     product_id = value if key == "product_id" else self.product_id   
    #     service_id = value if key == "service_id" else self.service_id   

    #     if not (product_id or service_id):
    #         raise ValueError("Review must belong to a product or service")
    #     if product_id and service_id:
    #         raise ValueError("Review cannot belong to both")    
    #     return value


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category_type = db.Column(db.String, nullable=False)

    products = db.relationship("Product", back_populates="category")
    services = db.relationship("Service", back_populates="category")

    serialize_rules = ("-products", "-services",)

    @validates("category_type")
    def validate_category(self,key,value):
        if value not in ["Product", "Service"]:
            raise ValueError("Category_type can either be a Product or Service")
        return value
    

# Admin: delivery zones for Vetty orders
class DeliveryZone(db.Model, SerializerMixin):
    __tablename__ = "delivery_zones"

    id = db.Column(db.Integer, primary_key=True)
    zone_name = db.Column(db.String, nullable=False)  # Zone name
    delivery_fee = db.Column(db.Integer, nullable=False)  # Fee per zone

    orders = db.relationship("Order", back_populates="delivery_zone")

    serialize_rules = ("-orders.delivery_zone",)


# Admin: inventory alerts for low-stock items
class InventoryAlert(db.Model, SerializerMixin):
    __tablename__ = "inventory_alerts"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), unique=True)
    threshold = db.Column(db.Integer, nullable=False)
    


    product = db.relationship("Product", back_populates="inventory_alert")


    serialize_rules = ("-product.inventory_alert",)


class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    delivery_zone_id = db.Column(db.Integer, db.ForeignKey("delivery_zones.id"))
    status = db.Column(db.String, nullable=False, default="Pending")
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    #total amount calculates as a hybrid property

    #relationships
    user = db.relationship("User", back_populates="orders")
    order_items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")   
    history = db.relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan")
    payments = db.relationship("Payment", back_populates="order")

    delivery_zone = db.relationship("DeliveryZone", back_populates="orders")
    

    serialize_rules = ("total_amount", "-user", "-order_items.order", "-history", "-payments", "-delivery_zone", '-order_items.product')

    @validates("status")
    def validate_status(self, key,value):
        if value not in ["Pending", "Approved", "Out for Delivery", "Delivered", "Cancelled"]:
            raise ValueError("Invalid entry")
        return value 
    @hybrid_property
    def total_amount(self):
        return sum(item.subtotal for item in self.order_items)



class OrderItem(db.Model, SerializerMixin):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    quantity = db.Column(db.Integer, default=1)
    unit_price = db.Column(db.Integer, nullable=False) 

    order = db.relationship("Order", back_populates="order_items")
    product = db.relationship("Product", back_populates="order_items")

    # serialize_rules = ("subtotal", "-order.order_items", "-product.order_items",)
    # serialize_rules = ("subtotal", "-order", "-product",)
    serialize_rules = ("subtotal", "-order", "-product.order_items",)


    @hybrid_property
    def subtotal(self):
        return self.quantity * self.unit_price


class Payment(db.Model, SerializerMixin):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey("appointments.id"), nullable=True)
    payment_method = db.Column(db.String, nullable=False)

    
    #mpeasa specific fields
    checkout_request_id = db.Column(db.String, unique=True, nullable=True)#from daraja API
    merchant_request_id = db.Column(db.String, nullable=True)
    phone_number = db.Column(db.String, nullable=True)#the number that payed
    amount = db.Column(db.Integer, nullable=False)
    # amount = db.Column(db.Float, nullable=False)
    mpesa_receipt_number = db.Column(db.String, unique=True, nullable=True)#recieved from callbak    #transaction_reference
    status = db.Column(db.String, default="pending")#pending ,success, failed
    paid_at = db.Column(db.DateTime(timezone=True), server_default=func.now()) #paid at


    appointment = db.relationship("Appointment", back_populates="payments")
    order = db.relationship("Order", back_populates="payments")
    user = db.relationship("User", back_populates="payments")


    serialize_rules = ("-order", "-appointment", "-user")


    @validates('payment_method')
    def validate_method(self, key, method):
        allowed = ['M-Pesa', 'Cash']
        if method not in allowed:
            raise ValueError(f"Method must be one of {allowed}")
        return method
    @validates("order_id", "appointment_id")
    def validate_target(self, key, value):
        order_id = value if key == "order_id" else self.order_id   
        appointment_id = value if key == "appointment_id" else self.appointment_id   

        if not (order_id or appointment_id):
            raise ValueError("Payment must belong to a order or appointment")
        if order_id and appointment_id:
            raise ValueError("Payment cannot belong to both")    
        return value
    @validates("status")
    def validate_payment_status(self, key, value):
        if value not in ["pending", "success", "fail"]:
            raise ValueError("invalid entry!")
        return value    
    
class Cart(db.Model, SerializerMixin):
    __tablename__ = "carts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, server_default=func.now())
    
    cart_items = db.relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")
    user = db.relationship("User", back_populates="carts")

    serialize_rules = ("-cart_items.cart", "-user.carts")



class CartItem(db.Model, SerializerMixin):
    __tablename__ = "cart_items"

    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey("carts.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    quantity = db.Column(db.Integer, nullable=False, default=1)

    __table_args__ = (
        db.UniqueConstraint("cart_id", "product_id", name="uix_cart_product"),
    )

    product = db.relationship("Product", back_populates="cart_items")
    cart  = db.relationship("Cart", back_populates="cart_items")


    serialize_rules = ("-product.cart_items", "-cart.cart_items")
    @validates("quantity")
    def validate_quantity(self, key, value):
        if value < 1:
            raise ValueError("Quantity must be >=1")
        return value    
class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    users = db.relationship('User', back_populates="role")

    serialize_rules = ('-users.role',)

    def __repr__(self):
        return f"<Role {self.id} {self.name}>"



class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    @property
    def password(self):
        raise AttributeError("Password is write-only") 

    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.generate_password_hash(
            password.encode("utf-8")
        ).decode("utf-8")    

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))
    
    appointments = db.relationship("Appointment", back_populates="user", cascade="all, delete-orphan")
    carts = db.relationship("Cart", back_populates="user", uselist=False)  #added uselist
    payments = db.relationship("Payment", back_populates="user")
    orders = db.relationship("Order", back_populates="user")
    reviews = db.relationship("Review", back_populates="user")
    role = db.relationship("Role", back_populates="users")

    
    serialize_rules = ("-_password_hash", "-orders", "-appointments", "-role", "-carts", "-payments", "-reviews")

    @validates("email")    
    def validate_email(self, key, email):
        if "@" not  in email:
            raise ValueError("Invalid email!")
        return email    

    def __repr__(self):
        return f"<User '{self.username}' - {self.role.name if self.role else 'no role'}>"

class Appointment(db.Model, SerializerMixin):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String, default="Scheduled")
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    notes = db.Column(db.Text)
    total_price = db.Column(db.Integer)

    user = db.relationship("User", back_populates="appointments")
    payments = db.relationship("Payment", back_populates="appointment", cascade="all, delete-orphan")
    service = db.relationship("Service", back_populates="appointments")

    serialize_rules = ("-user.appointments", "-service.appointments","-payments.appointment")
    @validates("status")
    def validate_status(self, key,value):
        if value not in ["Pending", "Approved", "Scheduled", "Completed", "Cancelled", "No-Show"]:
            raise ValueError("Invalid entry")
        return value 


class OrderStatusHistory(db.Model, SerializerMixin):
    __tablename__ = "order_status_history"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    status = db.Column(db.String, nullable=False)
    changed_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
   

    order = db.relationship("Order", back_populates="history")
    serialize_rules = ("-order.history",)

@event.listens_for(Review, "before_insert")
@event.listens_for(Review, "before_update")
def validate_review_target(mapper, connection, target):
    if not (target.product_id or target.service_id):
        raise ValueError("Review must belong to a product or service")
    if target.product_id and target.service_id:
        raise ValueError("Review cannot belong to both")
