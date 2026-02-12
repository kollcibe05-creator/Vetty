import pytest

import sys

import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config import db, app


@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()
