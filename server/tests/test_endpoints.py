

import pytest

import sys

import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


from config import app, db
from models import User, Product  
from flask import json



@pytest.fixture(scope="module")
def test_client():
    """
    Set up Flask test client and temporary database for testing.
    """
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"  # in-memory DB
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


    with app.app_context():
        db.create_all()
        yield app.test_client() 
        db.drop_all()  


@pytest.fixture
def sample_user():
    """
    Returns a sample user object for testing.
    """
    user = User(username="testuser", email="test@example.com")
    db.session.add(user)
    db.session.commit()
    yield user
    db.session.delete(user)
    db.session.commit()

@pytest.fixture
def sample_product():
    product = Product(name="Test Product", description="Test Description")
    db.session.add(product)
    db.session.commit()
    yield product
    db.session.delete(product)
    db.session.commit()



def test_home_endpoint(test_client):
    """Test a simple GET request to the root or health check."""
    response = test_client.get('/')
    assert response.status_code in [200, 404]  

def test_create_user(test_client):
    """Test creating a new user via POST."""
    payload = {"username": "newuser", "email": "newuser@example.com"}
    response = test_client.post(
        "/users",  
        data=json.dumps(payload),
        content_type='application/json'
    )
    assert response.status_code == 201 or response.status_code == 200
    data = json.loads(response.data)
    assert data["username"] == "newuser"

def test_get_user(test_client, sample_user):
    """Test retrieving a user."""
    response = test_client.get(f"/users/{sample_user.id}")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["username"] == sample_user.username

def test_update_user(test_client, sample_user):
    """Test updating a user."""
    payload = {"username": "updateduser"}
    response = test_client.put(
        f"/users/{sample_user.id}",
        data=json.dumps(payload),
        content_type='application/json'
    )
    assert response.status_code in [200, 204]
    updated_user = User.query.get(sample_user.id)
    assert updated_user.username == "updateduser"

def test_delete_user(test_client, sample_user):
    """Test deleting a user."""
    response = test_client.delete(f"/users/{sample_user.id}")
    assert response.status_code in [200, 204]
    deleted_user = User.query.get(sample_user.id)
    assert deleted_user is None

def test_product_endpoint(test_client, sample_product):
    """Test retrieving a product."""
    response = test_client.get(f"/products/{sample_product.id}")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["name"] == sample_product.name
