import os
from dotenv import load_dotenv

from flask import Flask, render_template
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData


load_dotenv()


app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/dist',  
    template_folder='../client/dist'
    )

# app.secret_key = os.getenv('SECRET_KEY')
app.secret_key = os.getenv('SECRET_KEY')
# app.secret_key = b'\xf2\x9e\xa7\xea+b]\xe04\xfd\xcd?a_\xf4:'


app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False


metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)

migrate = Migrate(app, db)
db.init_app(app)

bcrypt = Bcrypt(app)

api = Api(app)

CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "https://vetty-siuq.onrender.com",
    #ngrok to be added
])

app.config.update(
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=False  #False ~ for local development
)

# postgresql://my_database_a8uk_user:neY6nIFxps6U7qzSbzZoCMSBmsTQi0Ho@dpg-d5kjbedactks7392rp10-a.oregon-postgres.render.com/vetty_db

@app.route('/')
def index():
    return render_template("index.html")

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")