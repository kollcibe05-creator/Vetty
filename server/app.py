from flask import request, session 
from flask_restful import Resource
from datetime import datetime
from functools import wraps
import base64
import requests 

# Import from your local project files
from config import app, db, api, bcrypt
from models import (
    Product, CartItem, Cart, DeliveryZone, 
    InventoryAlert, Service, Payment, Order, 
    OrderItem, Review, User, Role, OrderStatusHistory,
    Appointment, Category
)

# --- DECORATORS ---

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

# --- AUTH RESOURCES ---

class Signup(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter_by(email=data.get("email")).first():
            return {"error": "Email already registered"}, 400
        try:
            customer_role = Role.query.filter_by(name="Customer").first()
            new_user = User(
                username=data.get('username'),
                email=data.get('email'),
                role=customer_role,
                vetting_status='not_started' 
            )
            new_user.password = data.get('password')  
            db.session.add(new_user)
            db.session.flush() 

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

# --- CORE BUSINESS RESOURCES ---

class ProductList(Resource):
    def get(self):
        # 1. Get query params from the URL
        category_name = request.args.get('category')
        search = request.args.get('search')
        sort_by = request.args.get('sort_by', 'name')
        sort_order = request.args.get('sort_order', 'asc')

        query = Product.query

        # 2. Filter by Category (joining with Category table)
        if category_name:
            query = query.join(Category).filter(Category.name == category_name)

        # 3. Filter by Search
        if search:
            query = query.filter(Product.name.ilike(f"%{search}%"))

        # 4. Sorting
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
        # Fetch the product by ID
        product = db.session.get(Product, id)
        if not product:
            return {"error": "Product not found"}, 404
        
        # Return the product as a dictionary
        return product.to_dict(), 200

    @admin_required
    def patch(self, id):
        product = db.session.get(Product, id)
        if not product:
            return {"error": "Product not found"}, 404
            
        data = request.get_json()
        for attr in data:
            setattr(product, attr, data.get(attr))
            
        db.session.commit()
        return product.to_dict(), 200

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
        # Use snake_case to match what Redux is sending
        search = request.args.get('search')
        category_name = request.args.get('category') # Add this!
        sort_by = request.args.get('sort_by', 'name')
        sort_order = request.args.get('sort_order', 'asc')

        query = Service.query

        # Filter by Category
        if category_name:
            query = query.join(Category).filter(Category.name == category_name)

        if search:
            query = query.filter(Service.name.ilike(f"%{search}%"))

        if hasattr(Service, sort_by):
            column = getattr(Service, sort_by)
            query = query.order_by(column.desc() if sort_order == 'desc' else column.asc())

        services = query.all()
        return [s.to_dict() for s in services], 200
class CartResource(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id: return {"error": "Unauthorized"}, 401
        
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart: return {"cart_items": [], "total_amount": 0}, 200
        
        total_amount = sum(item.quantity * item.product.price for item in cart.cart_items)
        return {
            "cart_items": [item.to_dict() for item in cart.cart_items],
            "total_amount": total_amount
        }, 200
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        
        data = request.get_json()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        # 1. Find or create the user's cart
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.flush()

        # 2. Check if item already in cart
        item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
        if item:
            item.quantity += quantity
        else:
            item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            db.session.add(item)
        
        db.session.commit()
        return item.to_dict(), 201

    def delete(self):
        user_id = session.get('user_id')
        if not user_id: return {"error": "Unauthorized"}, 401
        cart = Cart.query.filter_by(user_id=user_id).first()
        if cart:
            CartItem.query.filter_by(cart_id=cart.id).delete()
            db.session.commit()
        return {"message": "Cart cleared"}, 200

class Checkout(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id: return {"error": "Unauthorized"}, 401
        
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart or not cart.cart_items:
            return {"error": "Cart is empty"}, 400
            
        try:
            new_order = Order(user_id=user_id, status="Pending")
            db.session.add(new_order)
            db.session.flush()

            db.session.add(OrderStatusHistory(order=new_order, status="Pending"))
            
            # Check all products exist and have sufficient stock before proceeding
            for item in cart.cart_items:
                # Verify product still exists in database
                product = db.session.get(Product, item.product_id)
                if not product:
                    db.session.rollback()
                    return {"error": f"Product no longer available"}, 400
                
                # Check stock availability
                if product.stock_quantity < item.quantity:
                    db.session.rollback()
                    return {"error": f"Insufficient stock for {product.name}"}, 400
            
            # All checks passed - proceed with stock subtraction and order creation
            for item in cart.cart_items:
                product = Product.query.get(item.product_id)
                
                # Subtract stock quantity
                product.stock_quantity -= item.quantity
                
                # Create order item
                db.session.add(OrderItem(
                    order=new_order, product_id=item.product_id,
                    quantity=item.quantity, unit_price=item.product.price
                ))

            # Clear cart and commit transaction
            CartItem.query.filter_by(cart_id=cart.id).delete()
            db.session.commit()
            return new_order.to_dict(), 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422
        
class AppointmentList(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Authentication required"}, 401

        data = request.get_json()
        
        try:
            # Convert string date from frontend to Python datetime object
            appointment_date_str = data.get("appointment_date")
            if not appointment_date_str:
                return {"error": "Appointment date is required"}, 400
                
            # Handle frontend datetime-local format (e.g., "2026-02-10T01:10")
            appointment_date = datetime.fromisoformat(appointment_date_str)
            
            if appointment_date < datetime.now():
                return {"error": "Appointment date cannot be in the past"}, 400

            new_appointment = Appointment(
                user_id=user_id,
                service_id=data.get('service_id'),
                appointment_date=appointment_date,
                notes=data.get("notes"),
                total_price=data.get('total_price'),
                delivery_zone_id=data.get('delivery_zone_id'),
                status='Scheduled' # Initial status matching model validation
            )
            
            db.session.add(new_appointment)
            db.session.commit()
            return new_appointment.to_dict(), 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422



# ... existing imports and classes

class ServiceByID(Resource):
    def get(self, id):
        # Use db.session.get() which is the modern SQLAlchemy way
        service = db.session.get(Service, id)
        if not service:
            return {"error": "Service not found"}, 404
        return service.to_dict(), 200
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

# --- USER HISTORY RESOURCES ---

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
        
        # This shows the status (Scheduled, Completed, Cancelled)
        appointments = Appointment.query.filter_by(user_id=user_id).order_by(Appointment.appointment_date.desc()).all()
        return [a.to_dict() for a in appointments], 200



class AdminAppointmentResource(Resource):
    @admin_required
    def patch(self, appointment_id):
        try:
            appointment = Appointment.query.get(appointment_id)
            if not appointment:
                return {"error": "Appointment not found"}, 404
            
            data = request.get_json()
            new_status = data.get('status')
            
            if new_status in ['Completed', 'Cancelled']:
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


# --- ADMIN APPOINTMENT MANAGEMENT ---

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

        business_shortcode = "174379"
        passkey = os.getenv('MPESA_KEY')
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        
        # Proper Password Generation
        data_to_encode = business_shortcode + passkey + timestamp
        password = base64.b64encode(data_to_encode.encode()).decode('utf-8')

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
                "CallBackURL": "https://thallous-nongraduated-doris.ngrok-free.dev/callback", 
                "AccountReference": f"Order{order_id}" if order_id else "VettyPay",
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
            payment.status = 'Completed'
            
            if payment.order:
                payment.order.status = 'Paid'
            db.session.commit()
            
        return {"ResultCode": 0, "ResultDesc": "Success"}, 200


# --- ADMIN STATS ---

class AdminStats(Resource):
    @admin_required
    def get(self):
        rev = db.session.query(db.func.sum(Payment.amount)).filter_by(status='Completed').scalar() or 0
        return {
            "revenue": float(rev),
            "pending_orders": Order.query.filter_by(status='Pending').count(),
            "low_stock": InventoryAlert.query.count()
        }, 200

# --- API ROUTE REGISTRATION ---

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')
api.add_resource(ServiceList, '/services')
api.add_resource(ProductList, '/products')

api.add_resource(CartResource, '/cart', '/cart-items') # Mapped to both to fix your CORS error
api.add_resource(Checkout, "/check-out")
api.add_resource(AppointmentList, '/appointments')
api.add_resource(AdminAppointmentList, '/admin/appointments')
api.add_resource(AdminAppointmentResource, '/admin/appointments/<int:appointment_id>')
api.add_resource(MpesaPayment, '/payments/mpesa')
api.add_resource(MpesaCallback, '/callback')
api.add_resource(AdminStats, "/admin/stats")

api.add_resource(ServiceByID, '/services/<int:id>')
api.add_resource(CategoryList, '/categories')
api.add_resource(ProductByID, '/products/<int:id>')
api.add_resource(DeliveryZoneList, '/delivery-zones')


api.add_resource(UserOrders, '/my-orders')
api.add_resource(UserAppointments, '/my-appointments')

if __name__ == '__main__':
    app.run(port=5555, debug=True)