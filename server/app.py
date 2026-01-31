
from flask import request, session
from flask_restful import Resource
from config import app, db, api
from models import Product, CartItem, Cart, DeliveryZone, InventoryAlert, Service, Payment, Order, Order_Item, Review
from functools import wraps






if __name__ == "__main__":
    app.run(port=5555, debug=True)