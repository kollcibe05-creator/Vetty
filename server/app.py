
from flask import request, session, make_response, jsonify

from flask_restful import Resource
from config import app, db, api

from datetime import datetime

from models import Product, CartItem, Cart, DeliveryZone, InventoryAlert, Service, Payment, Order, OrderItem, Review

from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        user = User.query.get(user_id)
        if not user or user.role.name != "admin":
            return {"error": "Admin access required"}, 403
        return f(*args, **kwargs)
    return decorated_function

    

class Signup(Resource):
    def post(self):
        data = request.get_json()
        try:
            user_role = Role.query.filter_by(name='user').first()
            if not user_role:
                return {"error": "Default role not found"}, 500

            new_user = User(
                username=data.get('username'),
                email=data.get('email'),
                role_id=user_role.id
            )
            new_user.set_password(data.get('password'))
            db.session.add(new_user)
            db.session.commit()

            session['user_id'] = new_user.id

            resp = make_response({"message": "User created", "user_id": new_user.id}, 201)
            resp.set_cookie('user_id', str(new_user.id), httponly=True, max_age=3600*24)
            return resp
        except Exception as e:
            db.session.rollback()
            return {"errors": str(e)}, 422


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.check_password(data.get('password')):
            session['user_id'] = user.id

            resp = make_response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role.name
                }
            }, 200)

            resp.set_cookie('user_id', str(user.id), httponly=True, max_age=3600*24)
            return resp

        return {"error": "Invalid username or password"}, 401


class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        resp = make_response({}, 204)
        resp.set_cookie('user_id', '', expires=0)
        return resp


class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id') or request.cookies.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                return {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role.name
                }, 200
        return {"error": "Not logged in"}, 401




class UserList(Resource):
    @admin_required
    def get(self):
        users = User.query.all()
        return [{
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role.name
        } for u in users], 200




class CategoryList(Resource):
    def get(self):
        categories = Category.query.all()
        return [{"id": c.id, "name": c.name, "category_type": c.category_type} for c in categories], 200

    @admin_required
    def post(self):
        data = request.get_json()
        new_category = Category(
            name=data.get('name'),
            category_type=data.get('category_type')
        )
        db.session.add(new_category)
        db.session.commit()
        return {"message": "Category created", "id": new_category.id}, 201




class ProductList(Resource):
    def get(self):
        products = Product.query.all()
        return [{
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "stock_quantity": p.stock_quantity
        } for p in products], 200

    @admin_required
    def post(self):
        data = request.get_json()
        new_product = Product(
            name=data.get('name'),
            description=data.get('description'),
            image_url=data.get('image_url'),
            price=data.get('price'),
            stock_quantity=data.get('stock_quantity', 0),
            category_id=data.get('category_id')
        )
        db.session.add(new_product)
        db.session.commit()
        return {"message": "Product created", "id": new_product.id}, 201




class ServiceList(Resource):
    def get(self):
        services = Service.query.all()
        return [{
            "id": s.id,
            "name": s.name,
            "base_price": s.base_price
        } for s in services], 200

    @admin_required
    def post(self):
        data = request.get_json()
        new_service = Service(
            name=data.get('name'),
            description=data.get('description'),
            base_price=data.get('base_price'),
            image_url=data.get('image_url'),
            category_id=data.get('category_id')
        )
        db.session.add(new_service)
        db.session.commit()
        return {"message": "Service created", "id": new_service.id}, 201




class DeliveryZoneList(Resource):
    def get(self):
        zones = DeliveryZone.query.all()
        return [{"id": z.id, "zone_name": z.zone_name, "delivery_fee": z.delivery_fee} for z in zones], 200

    @admin_required
    def post(self):
        data = request.get_json()
        new_zone = DeliveryZone(
            zone_name=data.get('zone_name'),
            delivery_fee=data.get('delivery_fee')
        )
        db.session.add(new_zone)
        db.session.commit()
        return {"message": "Delivery zone created", "id": new_zone.id}, 201




class ReviewList(Resource):
    def get(self):
        reviews = Review.query.all()
        return [{
            "id": r.id,
            "user_id": r.user_id,
            "comment": r.comment,
            "product_id": r.product_id,
            "service_id": r.service_id,
            "rating": r.rating
        } for r in reviews], 200

    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        new_review = Review(
            user_id=user_id,
            comment=data.get('comment'),
            product_id=data.get('product_id'),
            service_id=data.get('service_id'),
            rating=data.get('rating')
        )
        db.session.add(new_review)
        db.session.commit()
        return {"message": "Review created", "id": new_review.id}, 201




class AppointmentList(Resource):
    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        new_appointment = Appointment(
            user_id=user_id,
            service_id=data.get('service_id'),
            appointment_date=datetime.fromisoformat(data.get('appointment_date')),
            total_price=data.get('total_price'),
            payment_status=data.get('payment_status', 'pending')
        )
        db.session.add(new_appointment)
        db.session.commit()
        return {"message": "Appointment created", "id": new_appointment.id}, 201




class CartList(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        carts = Cart.query.filter_by(user_id=user_id).all()
        return [{"id": c.id, "created_at": c.created_at.isoformat()} for c in carts], 200




class CartItemList(Resource):
    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.commit()

        new_item = CartItem(
            cart_id=cart.id,
            product_id=data.get('product_id'),
            quantity=data.get('quantity', 1)
        )
        db.session.add(new_item)
        db.session.commit()
        return {"message": "Item added to cart", "id": new_item.id}, 201




class PaymentList(Resource):
    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        new_payment = Payment(
            user_id=user_id,
            order_id=data.get('order_id'),
            appointment_id=data.get('appointment_id'),
            payment_method=data.get('payment_method'),
            transaction_reference=data.get('transaction_reference'),
            amount=data.get('amount'),
            payment_status=data.get('payment_status', 'pending'),

            checkout_request_id=data.get('checkout_request_id'),
            merchant_request_id=data.get('merchant_request_id'),
            phone_number=data.get('phone_number'),
            mpesa_receipt_number=data.get('mpesa_receipt_number'),
            status=data.get('status'),
            payment_date=datetime.utcnow()
        )
        db.session.add(new_payment)
        db.session.commit()
        return {"message": "Payment initiated", "id": new_payment.id}, 201




class OrderList(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        orders = Order.query.filter_by(user_id=user_id).all()
        return [{
            "id": o.id,
            "total_price": o.total_price,
            "current_status": o.current_status
        } for o in orders], 200




api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')
api.add_resource(UserList, '/users')
api.add_resource(CategoryList, '/categories')
api.add_resource(ProductList, '/products')
api.add_resource(ServiceList, '/services')
api.add_resource(DeliveryZoneList, '/delivery-zones')
api.add_resource(ReviewList, '/reviews')
api.add_resource(AppointmentList, '/appointments')
api.add_resource(CartList, '/carts')
api.add_resource(CartItemList, '/cart-items')
api.add_resource(PaymentList, '/payments')




if __name__ == "__main__":
    app.run(port=5555, debug=True)
