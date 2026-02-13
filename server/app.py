from flask import request, session 
from sqlalchemy.orm import joinedload
from flask_restful import Resource
from datetime import datetime
from functools import wraps
import base64
import requests 
import os 


from config import app, db, api, bcrypt
from models import (
    Product, CartItem, Cart, DeliveryZone, 
    InventoryAlert, Service, Payment, Order, 
    OrderItem, Review, User, Role, OrderStatusHistory,
    Appointment, Category
)


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        user = db.session.get(User, user_id)
        if not user or user.role.name != "Admin":
            return {"error": "Admin access required"}, 403
        return f(*args, **kwargs)
    return decorated_function


class Signup(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter_by(email=data.get("email")).first():
            return {"error": "Email already registered"}, 400
        try:
            role_name = data.get('role', 'User')
            if role_name == 'Admin':
                role = Role.query.filter_by(name="Admin").first()
            else:
                role = Role.query.filter_by(name="User").first()
            if not role:
                return {"error": "Role not configured"}, 500

            
            new_user = User(
                username=data.get('username'),
                email=data.get('email'),
                role=role,
                # vetting_status='not_started',
                # business_name=data.get('businessName'),
                # business_description=data.get('businessDescription')
            )
            new_user.password = data.get('password')  
            db.session.add(new_user)
            db.session.flush() 

            if role_name != 'Admin':
                new_cart = Cart(user_id=new_user.id)
                db.session.add(new_cart)
            
            db.session.commit()
            session['user_id'] = new_user.id
            return new_user.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"errors": [str(e)]}, 422

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()
        if not user or not user.check_password(data.get('password')):
            return {"error": "Invalid credentials"}, 401
        session['user_id'] = user.id
        return user.to_dict(), 200

class Logout(Resource):
    def delete(self):
        session.clear()
        return {}, 204

class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id") 
        if user_id:
            user = db.session.get(User, user_id)
            if user:
                return user.to_dict(), 200
        return {"error": "Not logged in"}, 401


class ProductList(Resource):
    def get(self):
        category_name = request.args.get('category')
        search = request.args.get('search')
        sort_by = request.args.get('sort_by', 'name')
        sort_order = request.args.get('sort_order', 'asc')

        query = Product.query

        if category_name:
            query = query.join(Category).filter(Category.name == category_name)

        
        if search:
            query = query.filter(Product.name.ilike(f"%{search}%"))

        if hasattr(Product, sort_by):
            column = getattr(Product, sort_by)
            if sort_order == 'desc':
                query = query.order_by(column.desc())
            else:
                query = query.order_by(column.asc())

        products = query.all()
        return [p.to_dict() for p in products], 200
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
        return new_product.to_dict(), 201
    
class ProductByID(Resource):
    def get(self, id):

        product = db.session.get(Product, id)
        if not product:
            return {"error": "Product not found"}, 404
        

        return product.to_dict(), 200

    @admin_required
    def patch(self, id): 
        product = Product.query.filter_by(id=id).first()
        if not product:
            return {"error": "Product not found"}, 444

        data = request.get_json()

        updateable_columns = ['name', 'description', 'image_url', 'price', 'stock_quantity', 'category_id']

        for attr in data:
            if attr in updateable_columns:
                setattr(product, attr, data.get(attr))

        
        try:
            db.session.commit()
            return product.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400
    @admin_required
    def delete(self, id):
        product = db.session.get(Product, id)
        if not product:
            return {"error": "Product not found"}, 404
            
        db.session.delete(product)
        db.session.commit()
        return {}, 204
     

class ServiceList(Resource):
    def get(self):
        search = request.args.get('search')
        category_name = request.args.get('category')
        sort_by = request.args.get('sort_by', 'name')
        sort_order = request.args.get('sort_order', 'asc')

        query = Service.query

        if category_name:
            query = query.join(Category).filter(Category.name == category_name)

        if search:
            query = query.filter(Service.name.ilike(f"%{search}%"))

        if hasattr(Service, sort_by):
            column = getattr(Service, sort_by)
            query = query.order_by(
                column.desc() if sort_order == 'desc' else column.asc()
            )

        services = query.all()
        return [s.to_dict(rules=('category',)) for s in services], 200


    @admin_required
    def post(self):
        data = request.get_json()

        new_service = Service(
            name=data.get("name"),
            description=data.get("description"),
            base_price=data.get("base_price"),
            image_url=data.get("image_url"),
            category_id=data.get("category_id"),
        )

        db.session.add(new_service)
        db.session.commit()

        return new_service.to_dict(rules=('category',)), 201


class CartResource(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            return {"items": [], "total_amount": 0}, 200

        total_amount = sum(
            item.quantity * item.product.price
            for item in cart.cart_items
        )

        return {
            "items": [item.to_dict(rules=('-cart',)) for item in cart.cart_items],
            "total_amount": total_amount
        }, 200


class CartItemResource(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        data = request.get_json()
        product_id = data.get("product_id")
        product = db.session.get(Product, product_id)
        
        if not product:
            return {"error": "Product not found"}, 404

        quantity = data.get("quantity", 1)
        if quantity > product.stock_quantity:
            return {"error": "Insufficient stock"}, 400

        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.commit()

        cart_item = CartItem.query.filter_by(
            cart_id=cart.id,
            product_id=product_id
        ).first()

        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity
            )
            db.session.add(cart_item)

        db.session.commit()

        return cart_item.to_dict(), 201

    def delete(self, item_id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            return {"error": "Unauthorized"}, 401

        item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
        if not item:
            return {"error": "Item not found"}, 404

        db.session.delete(item)
        db.session.commit()

        return {"message": "Item removed"}, 200
    def patch(self, item_id):
        user_id = session.get('user_id')
        if not user_id: return {"error": "Unauthorized"}, 401
        
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            return {"error": "Cart not found"}, 404
        item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
        if not item: return {"error": "Cart item not found"}, 404

        if item.cart_id != cart.id: 
            return {"error": "Unauthorized"}, 401

        
        
        data = request.get_json()
        quantity = data.get('quantity')
        
        if quantity is not None and quantity > 0:
            item.quantity = quantity
        else:
            return {"error": "Invalid quantity"}, 400
        
        db.session.commit()
        return item.to_dict(), 200    



class Checkout(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized. Please log in to checkout."}, 401

        data = request.get_json()
        delivery_zone_id = data.get("delivery_zone_id")
        exact_location = data.get("exact_location")


        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart or not cart.cart_items:
            return {"error": "Your cart is empty"}, 400

        try:

            delivery_fee = 0
            if delivery_zone_id:
                zone = db.session.get(DeliveryZone, delivery_zone_id)
                if zone:
                    delivery_fee = zone.delivery_fee


            new_order = Order(
                user_id=user_id,
                delivery_zone_id=delivery_zone_id,
                exact_location=exact_location,
                status="Pending"
            )
            db.session.add(new_order)
            db.session.flush() 

            total_product_price = 0


            for item in cart.cart_items:
                product = item.product


                if product.stock_quantity < item.quantity:
                    db.session.rollback()
                    return {
                        "error": f"Insufficient stock for {product.name}. Only {product.stock_quantity} left."
                    }, 400

                item_total = item.quantity * product.price
                total_product_price += item_total


                product.stock_quantity -= item.quantity

                order_item = OrderItem(
                    order_id=new_order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    unit_price=product.price 
                )
                db.session.add(order_item)

                if product.stock_quantity <= 5:
                    existing_alert = InventoryAlert.query.filter_by(product_id=product.id).first()
                    if not existing_alert:
                        db.session.add(InventoryAlert(product_id=product.id))


            status_history = OrderStatusHistory(
                order_id=new_order.id,
                status="Pending"
            )
            db.session.add(status_history)


            
            CartItem.query.filter_by(cart_id=cart.id).delete()
            
            db.session.commit()

            return {
                "message": "Order placed successfully",
                "order_id": new_order.id,                
                "delivery_fee": float(delivery_fee)
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"error": "An error occurred during checkout", "details": str(e)}, 500   
class AppointmentList(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Authentication required"}, 401

        data = request.get_json()
        
        try:
            appointment_date_str = data.get("appointment_date")
            if not appointment_date_str:
                return {"error": "Appointment date is required"}, 400

            appointment_date = datetime.fromisoformat(appointment_date_str)
            
            if appointment_date < datetime.now():
                return {"error": "Appointment date cannot be in the past"}, 400
            service_id = data.get("service_id")
            if not service_id:
                return {"error": "Service ID is required"}, 400

            service = Service.query.get(service_id)
            if not service:
                return {"error": "Service not found"}, 404

            new_appointment = Appointment(
                user_id=user_id,
                service_id=data.get('service_id'),
                appointment_date=appointment_date,
                notes=data.get("notes"),
                total_price=service.base_price,
                delivery_zone_id=data.get('delivery_zone_id'),
                exact_location = data.get('exact_location'),
                status='Scheduled' 
            )
            
            db.session.add(new_appointment)
            db.session.commit()
            return new_appointment.to_dict(), 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422




class ServiceByID(Resource):

    def get(self, id):
        service = db.session.get(Service, id)
        if not service:
            return {"error": "Service not found"}, 404

        return service.to_dict(rules=('category',)), 200


    @admin_required
    def patch(self, id):
        service = db.session.get(Service, id)
        if not service:
            return {"error": "Service not found"}, 404

        data = request.get_json()

        allowed_fields = [
            "name",
            "description",
            "base_price",
            "image_url",
            "category_id"
        ]

        for field in allowed_fields:
            if field in data:
                setattr(service, field, data[field])

        db.session.commit()
        return service.to_dict(rules=('category',)), 200


    @admin_required
    def delete(self, id):
        service = db.session.get(Service, id)
        if not service:
            return {"error": "Service not found"}, 404

        db.session.delete(service)
        db.session.commit()

        return {"message": "Service deleted"}, 200

    
class CategoryList(Resource):
    def get(self):
        categories = Category.query.all()
        return [c.to_dict() for c in categories], 200

    @admin_required
    def post(self):
        data = request.get_json()
        new_category = Category(
            name=data.get('name'),
            category_type=data.get('category_type')
        )
        db.session.add(new_category)
        db.session.commit()
        return new_category.to_dict(), 201

class DeliveryZoneList(Resource):
    def get(self):
        zones = DeliveryZone.query.all()
        return [z.to_dict() for z in zones], 200

    @admin_required
    def post(self):
        data = request.get_json()
        new_zone = DeliveryZone(
            zone_name=data.get('zone_name'),
            delivery_fee=data.get('delivery_fee')
        )
        db.session.add(new_zone)
        db.session.commit()
        return new_zone.to_dict(), 201



class UserOrders(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        
        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
        return [o.to_dict() for o in orders], 200

class UserAppointments(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        appointments = Appointment.query.filter_by(user_id=user_id).order_by(Appointment.appointment_date.desc()).all()
        return [a.to_dict() for a in appointments], 200

class UserProfile(Resource):
    def get(self):
        """Fetch current logged-in user's profile"""
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401
        
        user = db.session.get(User, user_id)
        if not user:
            return {"error": "User not found"}, 404
        
        return user.to_dict(), 200

    def patch(self):
        """Update current user's profile"""
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        user = db.session.get(User, user_id)
        if not user:
            return {"error": "User not found"}, 404

        data = request.get_json()


        allowed_fields = ["username", "email", "password"]
        for field in allowed_fields:
            if field in data:
                try:
                    if field == "password":
                        user.password = data[field]  
                    else:
                        setattr(user, field, data[field])
                except ValueError as e:
                    return {"error": str(e)}, 400

        try:
            db.session.commit()
            return user.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500




class AdminAppointmentResource(Resource):
    @admin_required
    def patch(self, appointment_id):
        try:
            appointment = Appointment.query.get(appointment_id)
            if not appointment:
                return {"error": "Appointment not found"}, 404
            
            data = request.get_json()
            new_status = data.get('status')
            
            if new_status in ['Scheduled', 'Pending', 'Completed', 'Cancelled', 'Approved']:
                appointment.status = new_status
                db.session.commit()
                return appointment.to_dict(), 200
            else:
                return {"error": "Invalid status"}, 400
                
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    @admin_required
    def delete(self, appointment_id):
        try:
            appointment = Appointment.query.get(appointment_id)
            if not appointment:
                return {"error": "Appointment not found"}, 404
            
            db.session.delete(appointment)
            db.session.commit()
            return {"message": "Appointment deleted successfully"}, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500



class AdminAppointmentList(Resource):
    @admin_required
    def get(self):
        try:
            appointments = Appointment.query.all()
            if not appointments:
                return []
            return [appointment.to_dict() for appointment in appointments]
        except Exception as e:
            return {"error": str(e)}, 500


# --- MPESA / PAYMENT ---


# Helper to get Daraja Token
def get_mpesa_access_token():
    consumer_key = os.getenv('MPESA_CONSUMER_KEY')
    consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    r = requests.get(url, auth=(consumer_key, consumer_secret))
    return r.json().get('access_token')

class MpesaPayment(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id: 
            return {"error": "Unauthorized"}, 401
            
        data = request.get_json()
        phone = data.get('phone_number')
        amount = int(float(data.get('amount'))) 
        order_id = data.get('order_id') # Ensure this isn't None!
        appointment_id = data.get('appointment_id')
        

        business_shortcode = "174379"
        passkey = os.getenv('MPESA_KEY')
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        
        # Proper Password Generation
        data_to_encode = business_shortcode + passkey + timestamp
        password = base64.b64encode(data_to_encode.encode()).decode('utf-8')


        if not order_id and not appointment_id:
            return {"error": "Order ID or Appointment ID required"}, 400

        try:
            access_token = get_mpesa_access_token()
            if not access_token:
                return {"error": "Failed to get access token"}, 500

            headers = {"Authorization": f"Bearer {access_token}"}
            stk_payload = {
                "BusinessShortCode": business_shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone,
                "PartyB": business_shortcode,
                "PhoneNumber": phone,
                "CallBackURL": f"{os.getenv('BASE_URL')}/payments/callback",   #needs change
                "AccountReference":f"Order{order_id}" if order_id else f"Appointment{appointment_id}",
                "TransactionDesc": "Vetty Payment"
            }

            response = requests.post(
                "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                json=stk_payload,
                headers=headers
            )
            
            res_data = response.json()
            
            # Check if Safaricom actually accepted the request (ResponseCode '0' is success)
            if res_data.get('ResponseCode') == '0':
                new_payment = Payment(
                    user_id=user_id,
                    order_id=order_id,
                    appointment_id=appointment_id,
                    payment_method='M-Pesa',
                    phone_number=phone,
                    amount=amount,
                    status='pending',
                    checkout_request_id=res_data.get('CheckoutRequestID')
                )
                db.session.add(new_payment)
                db.session.commit()
                return {"message": "Success", "details": res_data}, 201
            else:
                return {"error": "Safaricom rejected request", "details": res_data}, 400

        except Exception as e:
            db.session.rollback()
            print(f"DEBUG ERROR: {str(e)}") # This shows up in your terminal
            return {"error": str(e)}, 500

class MpesaCallback(Resource):
    def post(self):
        data = request.get_json()
        # Look for 'ResultCode': 0 (Success)
        result_code = data['Body']['stkCallback']['ResultCode']
        checkout_id = data['Body']['stkCallback']['CheckoutRequestID']
        
        payment = Payment.query.filter_by(checkout_request_id=checkout_id).first()
        if payment and result_code == 0:
            payment.status = 'completed'
            
            if payment.order:
                payment.order.status = 'Paid'
            if payment.appointment:
                payment.appointment.status = 'Paid'

            db.session.commit()
            
        return {"ResultCode": 0, "ResultDesc": "Success"}, 200


# --- ADMIN STATS ---

class AdminStats(Resource):
    @admin_required
    def get(self):
        rev = db.session.query(db.func.sum(Payment.amount)).filter_by(status='completed').scalar() or 0
        return {
            "revenue": float(rev),
            "pending_orders": Order.query.filter_by(status='Pending').count(),
            "low_stock": Product.query.filter(Product.stock_quantity < 10).count()
        }, 200

# --- ADMIN INVENTORY ---
class DeliveryZoneResource(Resource):

    @admin_required
    def patch(self, id):
        zone = db.session.get(DeliveryZone, id)
        if not zone:
            return {"error": "Delivery zone not found"}, 404

        data = request.get_json()

        if "zone_name" in data:
            zone.zone_name = data["zone_name"]

        if "delivery_fee" in data:
            zone.delivery_fee = data["delivery_fee"]

        db.session.commit()
        return zone.to_dict(), 200

    @admin_required
    def delete(self, id):
        zone = db.session.get(DeliveryZone, id)
        if not zone:
            return {"error": "Delivery zone not found"}, 404

        db.session.delete(zone)
        db.session.commit()
        return {"message": "Delivery zone deleted"}, 200


class AdminInventory(Resource):
    @admin_required
    def get(self):
        products = Product.query.all()
        inventory = []
        for product in products:
            inventory.append({
                'id': product.id,
                'name': product.name,
                'stock_quantity': product.stock_quantity,
                'price': product.price,
                'category': product.category.name if product.category else 'Uncategorized'
            })
        return inventory, 200

# --- ADMIN ORDERS ---

class AdminOrders(Resource):
    @admin_required
    def get(self):
        orders = Order.query.options(joinedload(Order.user)).all()
        return [order.to_dict(rules=('user', '-user.orders')) for order in orders], 200

class AdminOrderResource(Resource):
    @admin_required
    def patch(self, order_id):
        order = db.session.get(Order, order_id)
        if not order:
            return {"error": "Order not found"}, 404

        data = request.get_json()
        status = data.get("status")
        valid_statuses = ["Pending", "Approved",  "Cancelled", "Out for Delivery", "Delivered", 'Paid']
        if status not in valid_statuses:
            return {"error": "Invalid status"}, 400

        # --- Reduce stock when moving to Out for Delivery ---
        if status == "Out for Delivery" and order.status not in ["Out for Delivery", "Delivered"]:
            for order_item in order.order_items:
                product = order_item.product
                if product:
                    product.stock_quantity -= order_item.quantity
                    if product.stock_quantity < 0:
                        product.stock_quantity = 0

                    if product.stock_quantity <= 5:
                        if not InventoryAlert.query.filter_by(product_id=product.id).first():
                            db.session.add(InventoryAlert(product_id=product.id))

        order.status = status
        db.session.commit()
        return order.to_dict(), 200

    @admin_required
    def delete(self, order_id):
        order = db.session.get(Order, order_id)
        if not order:
            return {"error": "Order not found"}, 404

        db.session.delete(order)
        db.session.commit()
        return {"message": "Order deleted"}, 200

# --- ADMIN APPROVALS ---

class AdminApprovals(Resource):
    @admin_required
    def get(self):
        pending_orders = Order.query.filter_by(status='Pending').all()
        return [order.to_dict() for order in pending_orders], 200




class AdminUsers(Resource):

    @admin_required
    def get(self):
        users = User.query.all()

        return [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.name if user.role else "user"
            }
            for user in users
        ], 200

class AdminUserDetail(Resource):

    @admin_required
    def patch(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()

        if "role_id" in data:
            user.role_id = data["role_id"]

        db.session.commit()

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role.name
        }, 200

    @admin_required
    def delete(self, user_id):
        user = User.query.get_or_404(user_id)


        Order.query.filter_by(user_id=user.id).delete()
        Appointment.query.filter_by(user_id=user.id).delete()
        Payment.query.filter_by(user_id=user.id).delete()
        Review.query.filter_by(user_id=user.id).delete()
        Cart.query.filter_by(user_id=user.id).delete()

        db.session.delete(user)
        db.session.commit()

        return {"message": "User deleted"}, 200

from flask_restful import Resource
from flask import request
from models import Review, db
from flask import jsonify

class ReviewResource(Resource):
    def get(self):
        """
        GET /reviews
        Optional query params:
          - product_id
          - service_id
        """
        product_id = request.args.get("product_id", type=int)
        service_id = request.args.get("service_id", type=int)

        query = Review.query

        if product_id:
            query = query.filter_by(product_id=product_id)
        if service_id:
            query = query.filter_by(service_id=service_id)

        reviews = query.all()
        return jsonify([r.to_dict() for r in reviews])

    def post(self):
        """
        POST /reviews
        Body example:
        {
            "user_id": 1,
            "product_id": 2,        # optional if service_id is given
            "service_id": null,
            "rating": 4,
            "comment": "Great product!"
        }
        """
        data = request.get_json()
        review = Review(
            user_id=data.get("user_id"),
            product_id=data.get("product_id"),
            service_id=data.get("service_id"),
            rating=data.get("rating"),
            comment=data.get("comment")
        )
        db.session.add(review)
        db.session.commit()
        return review.to_dict(), 201


class AdminDashboard(Resource):
    @admin_required
    def get(self):
        try:
            summary = {
                "total_users": User.query.count(),
                "total_products": Product.query.count(),
                "total_services": Service.query.count(),
                "total_orders": Order.query.count(),
                "total_appointments": Appointment.query.count(),
                "low_stock_products": Product.query.filter(Product.stock_quantity < 10).count()
            }


            rev_query = db.session.query(db.func.sum(Payment.amount)).filter(Payment.status == "completed").scalar()
            summary["total_revenue"] = float(rev_query) if rev_query else 0.0

            order_status_counts = db.session.query(Order.status, db.func.count(Order.id)).group_by(Order.status).all()
            order_status_data = {status: count for status, count in order_status_counts}


            sales_chart = []
            try:

                date_format = db.func.strftime("%Y-%m", Payment.created_at)
                monthly_sales = db.session.query(date_format, db.func.sum(Payment.amount))\
                    .filter(Payment.status == "completed")\
                    .group_by(date_format).all()
                
                sales_chart = [{"month": str(m), "revenue": float(a or 0)} for m, a in monthly_sales]
            except Exception as e:
                print(f"Chart Error: {e}") 
                sales_chart = [{"month": "No Data", "revenue": 0}]

            return {
                "summary": summary,
                "order_status_breakdown": order_status_data,
                "monthly_sales": sales_chart
            }, 200

        except Exception as e:
            import traceback
            traceback.print_exc() 
            return {"error": str(e)}, 500

# --- API ROUTE REGISTRATION ---

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')
api.add_resource(ServiceList, '/services')
api.add_resource(ProductList, '/products')

api.add_resource(CartResource, '/cart') 
api.add_resource(CartItemResource, '/cart-items', '/cart-items/<int:item_id>') # For individual cart item operations
api.add_resource(Checkout, "/checkout", "/check-out") 
api.add_resource(AppointmentList, '/appointments')
api.add_resource(AdminAppointmentList, '/admin/appointments')
api.add_resource(AdminAppointmentResource, '/admin/appointments/<int:appointment_id>')
api.add_resource(MpesaPayment, '/payments/mpesa')
api.add_resource(MpesaCallback, '/callback')
api.add_resource(AdminStats, "/admin/stats")
api.add_resource(AdminInventory, "/admin/inventory")
api.add_resource(AdminOrders, "/admin/orders")
api.add_resource(AdminApprovals, "/admin/approvals")

api.add_resource(ServiceByID, '/services/<int:id>')
api.add_resource(CategoryList, '/categories')
api.add_resource(ProductByID, '/products/<int:id>')
api.add_resource(DeliveryZoneList, '/delivery-zones')


api.add_resource(UserOrders, '/my-orders')
api.add_resource(UserAppointments, '/my-appointments')
api.add_resource(UserProfile, '/profile')
api.add_resource(AdminOrderResource, "/admin/orders/<int:order_id>")
api.add_resource(AdminUsers, "/admin/users")
api.add_resource(AdminUserDetail, "/admin/users/<int:user_id>")
api.add_resource(DeliveryZoneResource,'/delivery-zones/<int:id>')
api.add_resource(ReviewResource, "/reviews")

api.add_resource(AdminDashboard, "/admin/dashboard")






if __name__ == '__main__':
    app.run(port=5555, debug=True)