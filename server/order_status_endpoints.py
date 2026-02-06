from flask import session
from flask_restful import Resource
from models import Order, OrderStatusHistory
from config import db

class OrderStatus(Resource):
    def patch(self, order_id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found"}, 404

        # Check if user owns the order or is admin
        user = db.session.get(User, user_id)
        if order.user_id != user_id and user.role.name != "Admin":
            return {"error": "Access denied"}, 403

        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return {"error": "Status is required"}, 400

        if new_status not in ["Pending", "Approved", "Out for Delivery", "Delivered"]:
            return {"error": "Invalid status"}, 400

        try:
            # Update order status
            old_status = order.status
            order.status = new_status
            
            # Create status history entry
            status_history = OrderStatusHistory(
                order_id=order_id,
                status=new_status
            )
            db.session.add(status_history)
            
            db.session.commit()
            
            return {
                "message": f"Order status updated from {old_status} to {new_status}",
                "order": order.to_dict()
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to update status: {str(e)}"}, 500

    def get(self, order_id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found"}, 404

        # Check if user owns the order or is admin
        user = db.session.get(User, user_id)
        if order.user_id != user_id and user.role.name != "Admin":
            return {"error": "Access denied"}, 403

        return {
            "order": order.to_dict(),
            "status_history": [history.to_dict() for history in order.history]
        }, 200

class OrderStatusHistoryList(Resource):
    def get(self, order_id):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found"}, 404

        # Check if user owns the order or is admin
        user = db.session.get(User, user_id)
        if order.user_id != user_id and user.role.name != "Admin":
            return {"error": "Access denied"}, 403

        return [history.to_dict() for history in order.history], 200
