from flask import request, session
from flask_restful import Resource
from werkzeug.exceptions import NotFound, Unauthorized

from config import app, db, api

from models import (
    Product, CartItem, Cart, DeliveryZone,
    InventoryAlert, Service, Payment, Order,
    OrderItem, Review, User, Role, OrderStatusHistory,
    Appointment, Category
)

# =========================
# AUTH HELPERS
# =========================

def current_user():
    if "user_id" in session:
        return User.query.get(session["user_id"])
    return None


def login_required(func):
    def wrapper(*args, **kwargs):
        user = current_user()
        if not user:
            raise Unauthorized("Login required")
        return func(*args, **kwargs)
    return wrapper


def admin_required(func):
    def wrapper(*args, **kwargs):
        user = current_user()
        if not user or user.role.name != "admin":
            raise Unauthorized("Admin access required")
        return func(*args, **kwargs)
    return wrapper


# =========================
# AUTH ROUTES
# =========================

class Signup(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter_by(email=data.get("email")).first():
            return {"error": "Email already exists"}, 409

        role = Role.query.filter_by(name="user").first()

        user = User(
            username=data.get("username"),
            email=data.get("email"),
            role=role
        )
        user.password = data.get("password")

        db.session.add(user)
        db.session.commit()

        return user.to_dict(), 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data.get("email")).first()

        if not user or not user.authenticate(data.get("password")):
            return {"error": "Invalid credentials"}, 401

        session["user_id"] = user.id

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role.name
        }, 200


class Logout(Resource):
    def delete(self):
        session.pop("user_id", None)
        return {}, 204


class CheckSession(Resource):
    def get(self):
        user = current_user()
        if not user:
            return {}, 401
        return user.to_dict(), 200


# =========================
# PRODUCTS
# =========================

class Products(Resource):
    def get(self):
        return [p.to_dict() for p in Product.query.all()], 200


class ProductByID(Resource):
    def get(self, id):
        product = Product.query.get(id)
        if not product:
            raise NotFound("Product not found")
        return product.to_dict(), 200


# =========================
# SERVICES
# =========================

class Services(Resource):
    def get(self):
        return [s.to_dict() for s in Service.query.all()], 200


class ServiceByID(Resource):
    def get(self, id):
        service = Service.query.get(id)
        if not service:
            raise NotFound("Service not found")
        return service.to_dict(), 200


# =========================
# CATEGORIES
# =========================

class Categories(Resource):
    def get(self):
        return [c.to_dict() for c in Category.query.all()], 200


# =========================
# CART
# =========================

class CartResource(Resource):
    @login_required
    def get(self):
        user = current_user()
        cart = Cart.query.filter_by(user_id=user.id).first()
        return cart.to_dict(), 200 if cart else ({}, 200)


# =========================
# ORDERS
# =========================

class Orders(Resource):
    @login_required
    def get(self):
        user = current_user()
        orders = Order.query.filter_by(user_id=user.id).all()
        return [o.to_dict() for o in orders], 200


class OrderByID(Resource):
    @login_required
    def get(self, id):
        order = Order.query.get(id)
        if not order:
            raise NotFound("Order not found")
        return order.to_dict(), 200


# =========================
# PAYMENTS
# =========================

class UserPaymentListByID(Resource):
    @admin_required
    def get(self, id):
        payments = Payment.query.filter_by(user_id=id).all()
        return [p.to_dict() for p in payments], 200


# =========================
# REVIEWS
# =========================

class Reviews(Resource):
    def get(self):
        return [r.to_dict() for r in Review.query.all()], 200


# =========================
# ROUTES REGISTRATION
# =========================

api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, "/check_session")

api.add_resource(Products, "/products")
api.add_resource(ProductByID, "/products/<int:id>")

api.add_resource(Services, "/services")
api.add_resource(ServiceByID, "/services/<int:id>")

api.add_resource(Categories, "/categories")

api.add_resource(CartResource, "/cart")

api.add_resource(Orders, "/orders")
api.add_resource(OrderByID, "/orders/<int:id>")

api.add_resource(UserPaymentListByID, "/payments/<int:id>")
api.add_resource(Reviews, "/reviews")


# =========================
# RUN APP
# =========================

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)
