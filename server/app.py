
from flask import request, session 

from flask_restful import Resource
from config import app, db, api

from datetime import datetime

from models import (Product, CartItem, Cart, DeliveryZone, 
    InventoryAlert, Service, Payment, Order, 
    OrderItem, Review, User, Role, OrderStatusHistory,
    Appointment, Category
)

from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        user = User.query.get(user_id)
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
            customer_role = Role.query.filter_by(name="Customer").first()
            
            new_user = User(
                username=data.get('username'),
                email=data.get('email'),
                role=customer_role,
                # vetting_status='not_started' 
            )
            new_user.password = data.get('password')  
            db.session.add(new_user)
            db.session.flush() # Get the ID before committing

            # Create the cart using the Model explicitly
            from models import Cart as CartModel
            new_cart = CartModel(user_id=new_user.id)
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
        user = User.query.filter_by(username=data.get('username')).first()
        if not user:
            user = User.query.filter_by(email=data.get('email')).first()
            
        if user and user.check_password(data.get('password')):
            session['user_id'] = user.id
            return {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.name if user.role else "User"
            }, 200

        return {"error": "Invalid email/username or password"}, 401


class Logout(Resource):
    def delete(self):
        session["user_id"] = None
        return {}, 204


class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id") 
        if user_id:
            user = db.session.get(User, user_id)
            if user:
                return user.to_dict(), 200
            session["user_id"] = None    
            
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




class ProductList(Resource):
    def get(self):
        products = Product.query.all()
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




class ServiceList(Resource):
    def get(self):
        services = Service.query.all()
        return [s.to_dict() for s in services], 200

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
        return  new_service.to_dict(), 201




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
        return {"message": "Delivery zone created", "id": new_zone.id}, 201




class ReviewList(Resource):
    def get(self):
        reviews = Review.query.all()
        return [r.to_dict() for  r in reviews], 200
    
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        
        data = request.get_json()
        try:
            review = Review(
                rating=data.get('rating'),
                comment=data.get('comment'),
                user_id=user_id,
                product_id=data.get('product_id'),
                service_id=data.get('service_id')
            )
            db.session.add(review)
            db.session.commit()
            return review.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422


class AppointmentList(Resource):
    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        appointment_date = datetime.fromisoformat(data.get("appointment_date"))
        if appointment_date < datetime.now():
            return {"error": "Appointment date cannot be in the past"}, 400
        new_appointment = Appointment(
            user_id=user_id,
            service_id=data.get('service_id'),
            appointment_date=appointment_date,
            notes=data.get("notes"),
            total_price=data.get('total_price'),
            payment_status=data.get('payment_status', 'pending')
        )
        db.session.add(new_appointment)
        db.session.commit()
        return new_appointment.to_dict(), 201






class CartResource(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            return {"cart_items": [], "total_amount": 0}, 200

        cart_data = cart.to_dict()
        total_amount = sum(item.quantity * item.product.price for item in cart.cart_items)
        
        return {
            "cart_items": [item.to_dict() for item in cart.cart_items],
            "total_amount": total_amount
        }, 200

    def delete(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        cart = Cart.query.filter_by(user_id=user_id).first()
        if cart:
            CartItem.query.filter_by(cart_id=cart.id).delete()
            db.session.commit()
        
        return {"message": "Cart cleared"}, 200



class OrderList(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        user = db.session.get(User, user_id)
        if user.role.name == "Admin":
            orders = Order.query.all()
        else:
            orders = Order.query.filter_by(user_id=user_id).all()
        return [o.to_dict() for o in orders], 200
   
class Checkout(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart or not cart.cart_items:
            return {"error": "Cart is empty"}, 400
        try:
            new_order = Order(user_id=user_id, status="Pending")
            db.session.add(new_order)
            db.session.flush()
            # Create initial status history entry
            status_history = OrderStatusHistory(
                order=new_order,
                status="Pending"
            )
            db.session.add(status_history)
            
            for item in cart.cart_items:
                product = item.product

                if product.stock_quantity < item.quantity:
                    db.session.rollback()
                    return {"error": f"Insufficient stock for {product.name}"}, 400
                product.stock_quantity -= item.quantity
                

                if product.stock_quantity <= 5:
                    #checks if it already exists to avoid duplication
                    existing_alert = InventoryAlert.query.filter_by(product_id=product.id).first()
                    if not existing_alert:
                        new_alert = InventoryAlert(
                            product_id=product.id,
                            threshold=5
                        )
                        db.session.add(new_alert)

                order_item = OrderItem(
                    order=new_order,
                    product_id=product.id,
                    quantity=item.quantity,
                    unit_price=product.price
                )
                db.session.add(order_item)

            # 3. Clear the cart after successful order creation
            CartItem.query.filter_by(cart_id=cart.id).delete()
            db.session.commit()
            
            return new_order.to_dict(), 201
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422

  
class OrderStatusHistoryResource(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found"}, 404

        # Access Control: User must own the order or be an Admin
        user = User.query.get(user_id)
        if order.user_id != user_id and user.role.name != "Admin":
            return {"error": "Access denied"}, 403

        return {
            "order": order.to_dict(),
            "status_history": [h.to_dict() for h in order.history]
        }, 200

    @admin_required
    def patch(self, id):
        data = request.get_json()
        new_status = data.get("status")
        
        valid_statuses = ["Pending", "Approved", "Out for Delivery", "Delivered", "Cancelled"]
        if new_status not in valid_statuses:
            return {"error": f"Invalid status. Must be one of: {valid_statuses}"}, 400

        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found"}, 404

        try:
            order.status = new_status
            
            # Record the change in history
            history = OrderStatusHistory(
                order_id=order.id,
                status=new_status,
                changed_at=datetime.utcnow()
            )
            db.session.add(history)
            db.session.commit()

            
            return {"message": "Order updated", "order": order.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    

class InventoryAlertList(Resource):
    @admin_required
    def get(self):
        alerts = InventoryAlert.query.all()
        return [alert.to_dict() for alert in alerts]         

    @admin_required
    def delete(self, alert_id):
        alert = db.session.get(InventoryAlert, alert_id)    
        if alert:
            db.session.delete(alert)
            db.session.commit()
            return {}, 204
        return {"error": "Alert not found"}, 204    
    


class ProductByID(Resource):
    def get(self, id):
        product = Product.query.filter_by(id=id).first().to_dict()
        return product, 200
    @admin_required
    def patch (self,id):
        product = Product.query.filter_by(id=id).first()
        data = request.get_json()
        for attr in data:
            setattr(product, attr, data.get(attr))
        db.session.add(product)    
        db.session.commit()

        return product.to_dict(), 200
    @admin_required
    def delete(self, id):
        product = Product.query.filter_by(id=id).first()
        db.session.delete(product)
        db.session.commit()

        return {}, 204
class ServiceByID(Resource):
    def get(self, id):
        product = Service.query.filter_by(id=id).first().to_dict()
        return product, 200
    @admin_required
    def patch (self,id):
        service = Service.query.filter_by(id=id).first()
        data = request.get_json()
        for attr in data:
            setattr(service, attr, data.get(attr))
        db.session.add(service)    
        db.session.commit()

        return service.to_dict(), 200
    @admin_required
    def delete(self, id):
        service = Service.query.filter_by(id=id).first()
        db.session.delete(service)
        db.session.commit()

        return {}, 204

class UserPaymentListByID(Resource):
    @admin_required
    def get(self, user_id):
        user_payment = Payment.query.filter_by(user_id=user_id).all()
        return [u.to_dict() for u in user_payment], 200

class DeliveryZoneByID(Resource):
    @admin_required
    def get(self, id):
        delivery_zone = DeliveryZone.query.filter_by(id=id).first()
        return delivery_zone, 200
    @admin_required
    def patch(self, id):
        delivery_zone = DeliveryZone.query.filter_by(id=id).first()
        data = request.get_json()
        for attr in data:
            setattr(delivery_zone, attr, data.get(attr)) 
        db.session.add(delivery_zone) 
        db.session.commit()
        return delivery_zone.to_dict(), 200   
    @admin_required    
    def delete(self, id):
        delivery_zone = DeliveryZone.query.filter_by(id=id).first()
        db.session.delete(delivery_zone)
        db.session.commit()
        return {}, 204


class ApproveAppointment(Resource):
    @admin_required
    def patch(self, id):
        data = request.get_json()
        new_status = data.get('status') # e.g. 'Approved', 'Cancelled'
        
        appointment = Appointment.query.get(id)
        if not appointment:
            return {"error": "Appointment not found"}, 404

        if not new_status:
            return {"error": "Status is required"}, 400

        try:
            appointment.status = new_status
            # If your Appointment model has a payment_status, you could update it here too
            if new_status == "Completed":
                appointment.payment_status = "Paid"
                
            db.session.commit()
            return {
                "message": f"Appointment status updated to {new_status}",
                "appointment": appointment.to_dict()
            }, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    @admin_required
    def delete(self, id):
        appointment = Appointment.query.get(id)
        if not appointment:
            return {"error": "Appointment not found"}, 404
        
        db.session.delete(appointment)
        db.session.commit()
        return {}, 204
class OrderItems (Resource):
    def get(self, order_id):
        order_items = OrderItem.query.filter_by(order_id=order_id).all()
        return [o.to_dict() for o in order_items], 200
class OrderItemByID(Resource):
    @admin_required
    def get(self, id):
        order_item = OrderItem.query.filter_by(id=id).first()
        return order_item, 200




class PaymentList(Resource):
    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        if bool(data.get("order_id")) == bool(data.get("appointment_id")):
            return {"error": "Payment must be for either Order or Service"}    

        new_payment = Payment(
            user_id=user_id,
            order_id=data.get('order_id'),
            appointment_id=data.get('appointment_id'),
            payment_method=data.get('payment_method'),
            # transaction_reference=data.get('transaction_reference'),
            amount=data.get('amount'),
            status=data.get('status', 'pending'),

            checkout_request_id=data.get('checkout_request_id'),
            merchant_request_id=data.get('merchant_request_id'),
            phone_number=data.get('phone_number'),
            mpesa_receipt_number=data.get('mpesa_receipt_number'),
            # payment_date=datetime.utcnow()
        )
        db.session.add(new_payment)
        db.session.commit()
        return new_payment.to_dict(), 201


#Suleiman init
class MpesaPayment(Resource):
    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        # Validate phone number format
        phone_number = data.get('phone_number')
        if not phone_number or not phone_number.startswith('2547') or len(phone_number) != 12:
            return {"error": "Invalid M-Pesa phone number format. Use 2547XXXXXXXX"}, 400

        # Create payment record
        try:
            payment = Payment(
                user_id=user_id,
                order_id=data.get('order_id'),
                appointment_id=data.get('appointment_id'),
                payment_method='M-Pesa',
                phone_number=phone_number,
                amount=data.get('amount'),
                status='pending',
                checkout_request_id=f"CHK_{datetime.now().strftime('%Y%m%d%H%M%S')}_{user_id}"
            )
            db.session.add(payment)
            db.session.commit()

            # Here you would integrate with actual M-Pesa API
            # For now, we'll simulate the payment initiation
            return {
                "message": "M-Pesa payment initiated successfully",
                "payment_id": payment.id,
                "checkout_request_id": payment.checkout_request_id,
                "phone_number": phone_number,
                "amount": payment.amount
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"error": f"Payment initiation failed: {str(e)}"}, 500


# class CartResource(Resource):
#     def get(self):
#         user_id = session.get('user_id')
#         if not user_id:
#             return {"error": "Unauthorized"}, 401


# class CartList(Resource):
#     def get(self):
#         user_id = session.get('user_id')
#         if not user_id:
#             return {"error": "Unauthorized"}, 401

#         carts = Cart.query.filter_by(user_id=user_id).all()
#         return [c.to_dict() for c in carts], 200




# class CartItemList(Resource):
#     def get(self):
#         user_id = session.get("user_id")
#         if not user_id:
#             return {"error": "Unauthorized"}, 401
#         cart = Cart.query.filter_by(user_id=user_id).first()
#         return [item.to_dict() for item in cart.cart_items] if cart else [], 200
#     def post(self):
#         data = request.get_json()
#         user_id = session.get('user_id')
#         if not user_id:
#             return {"error": "Unauthorized"}, 401

        
#         cart = Cart.query.filter_by(user_id=user_id).first()
#         product = db.session.get(Product, data.get("product_id"))
#         if not product or product.stock_quantity < data.get("quantity", 1):
#             return {"error": "Product unavailable or insufficient stock"}, 400
#         if not cart:
#             cart = Cart(user_id=user_id)
#             db.session.add(cart)
#             db.session.commit()
        

#         return {"message": "Cart cleared"}, 200

class CartItemResource(Resource):
    def patch(self, cart_item_id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        cart_item = CartItem.query.get(cart_item_id)
        if not cart_item or cart_item.cart.user_id != user_id:
            return {"error": "Cart item not found"}, 404

        data = request.get_json()
        new_quantity = data.get('quantity')
        
        if new_quantity and new_quantity > 0:
            if new_quantity > cart_item.product.stock_quantity:
                return {"error": "Insufficient stock"}, 400
            cart_item.quantity = new_quantity
            db.session.commit()

        cart = cart_item.cart
        total_amount = sum(item.quantity * item.product.price for item in cart.cart_items)
        
        return {
            "cart_items": [item.to_dict() for item in cart.cart_items],
            "total_amount": total_amount
        }, 200

    def delete(self, cart_item_id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        cart_item = CartItem.query.get(cart_item_id)
        if not cart_item or cart_item.cart.user_id != user_id:
            return {"error": "Cart item not found"}, 404

        db.session.delete(cart_item)
        db.session.commit()
        
        return {"message": "Item removed from cart"}, 200

class PaymentList(Resource):
    def post(self):
        data = request.get_json()
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        if bool(data.get("order_id")) == bool(data.get("appointment_id")):
            return {"error": "Payment must be for either Order or Service"}    

        new_payment = Payment(
            user_id=user_id,
            order_id=data.get('order_id'),
            appointment_id=data.get('appointment_id'),
            payment_method=data.get('payment_method'),
            # transaction_reference=data.get('transaction_reference'),
            amount=data.get('amount'),
            status=data.get('status', 'pending'),

            checkout_request_id=data.get('checkout_request_id'),
            merchant_request_id=data.get('merchant_request_id'),
            phone_number=data.get('phone_number'),
            mpesa_receipt_number=data.get('mpesa_receipt_number'),
            # payment_date=datetime.utcnow()
        )
        db.session.add(new_payment)
        db.session.commit()
        return {"message": "Payment initiated", "id": new_payment.id}, 201




# class OrderList(Resource):

#     def get(self):
#         user_id = session.get('user_id')
#         if not user_id:
#             return {"error": "Unauthorized"}, 401

#         user = db.session.get(User, user_id)
#         if user.role.name == "Admin":
#             orders = Order.query.all()
#         else:
#             orders = Order.query.filter_by(user_id=user_id).all()
#         return [o.to_dict() for o in orders], 200
#     def post(self):
#         user_id = session.get("user_id")
#         if not user_id:
#             return {"error": "Unauthorized"}, 401
#         data = request.get_json()
#         items = data.get("items", [])
#         if not items:
#             return {"error": "Order cannot be empty"}, 400

#         try:
#             new_order = Order(user_id=user_id, status="Pending")

#         item = CartItem.query.filter_by(cart_id=cart.id, product_id=product.id).first()    
#         if item:
#             item.quantity += data.get("quantity", 1)
#         else:
#             item = CartItem(
#                 cart_id=cart.id,
#                 product_id=product.id,
#                 quantity=data.get('quantity', 1)
#             )
#             db.session.add(item)
#             db.session.commit()
            
                

#         return item.to_dict(), 201

# class DashboardSummary(Resource):
#     @admin_required
#     def get(self):
#         # Calculate total revenue from completed payments
#         total_revenue = db.session.query(db.func.sum(Payment.amount)).filter(Payment.status == 'Completed').scalar() or 0
        
#         # Gather counts for the admin notification badges
#         summary = {
#             "revenue": float(total_revenue),
#             "pending_orders": Order.query.filter_by(status='Pending').count(),
#             "low_stock_alerts": InventoryAlert.query.filter_by(is_resolved=False).count(),
#             "upcoming_appointments": Appointment.query.filter(Appointment.appointment_date >= datetime.now()).count()
#         }
        
#         return summary, 200


# class CartItemResource(Resource):
#     def patch(self, cart_item_id):
#         user_id = session.get('user_id')
#         if not user_id:
#             return {"error": "Unauthorized"}, 401

#         cart_item = CartItem.query.get(cart_item_id)
#         if not cart_item or cart_item.cart.user_id != user_id:
#             return {"error": "Cart item not found"}, 404

#         data = request.get_json()
#         new_quantity = data.get('quantity')
        
#         if new_quantity and new_quantity > 0:
#             if new_quantity > cart_item.product.stock_quantity:
#                 return {"error": "Insufficient stock"}, 400
#             cart_item.quantity = new_quantity
#             db.session.commit()

#         cart = cart_item.cart
#         total_amount = sum(item.quantity * item.product.price for item in cart.cart_items)
        
#         return {
#             "cart_items": [item.to_dict() for item in cart.cart_items],
#             "total_amount": total_amount
#         }, 200

#     def delete(self, cart_item_id):
#         user_id = session.get('user_id')
#         if not user_id:
#             return {"error": "Unauthorized"}, 401

#         cart_item = CartItem.query.get(cart_item_id)
#         if not cart_item or cart_item.cart.user_id != user_id:
#             return {"error": "Cart item not found"}, 404

#         db.session.delete(cart_item)
#         db.session.commit()
        
#         return {"message": "Item removed from cart"}, 200





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

# api.add_resource(CartList, '/carts')
# api.add_resource(CartItemList, '/cart-items')
api.add_resource(CartResource, '/cart')
api.add_resource(CartItemResource, '/cart/<int:cart_item_id>')

# api.add_resource(CartResource, '/cart')

api.add_resource(PaymentList, '/payments')
api.add_resource(OrderList, "/orders")
api.add_resource(Checkout, "/check-out")
api.add_resource(OrderStatusHistoryResource, "/orders/status-history/<int:id>")
api.add_resource(InventoryAlertList, "/alerts", "/alerts/<int:alert_id>")

# Admin endpoints
class AdminStats(Resource):
    @admin_required
    def get(self):
        # Calculate total revenue from completed payments
        total_revenue = db.session.query(db.func.sum(Payment.amount)).filter(Payment.status == 'Completed').scalar() or 0
        
        # Gather counts for admin notification badges
        summary = {
            "revenue": float(total_revenue),
            "total_users": User.query.count(),
            "total_products": Product.query.count(),
            "total_services": Service.query.count(),
            "pending_orders": Order.query.filter_by(status='Pending').count(),
            "low_stock_alerts": InventoryAlert.query.count(),
            "upcoming_appointments": Appointment.query.filter(Appointment.appointment_date >= datetime.now()).count()
        }
        return summary, 200

class AdminUsers(Resource):
    @admin_required
    def get(self):
        users = User.query.all()
        return [user.to_dict() for user in users], 200

api.add_resource(AdminStats, "/admin/stats")
api.add_resource(AdminUsers, "/admin/users")


if __name__ == '__main__':
    app.run(port=5555, debug=True)
