import os
from flask import render_template
from dotenv import load_dotenv
load_dotenv()


from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

app = Flask(__name__)

#To be implemented later
# app.secret_key = os.getenv('SECRET_KEY')
app.secret_key = b'\xc9u/\xf0\xa8\xb6\xa5\xee\xe6G\xb7e\xb8,\xa98'


app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///app.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

migrate = Migrate(app, db)
db.init_app(app)

bcrypt = Bcrypt(app)

api = Api(app)
# CORS(app, 
#      origins=['http://localhost:5176', 'http://localhost:5173'],
#      supports_credentials=True,
#      methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
# )
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173" ])
