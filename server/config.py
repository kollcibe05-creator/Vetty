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


app.secret_key = os.getenv('SECRET_KEY')



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

CORS(app, supports_credentials=True, origins=[  # supports_credentials allows cookies to pass back and forth
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "https://vetty-siuq.onrender.com",
    "https://stacy-undegrading-osteopathically.ngrok-free.dev"
])

# The config. below hardens your Flask application's session cookies against session hijacking and Cross-Site Request Forgery (CSRF) attacks.
# It is standard production security middleware for managing user authentication state.
# SESSION_COOKIE_SECURE=True Prevents MITM interception ~ instructs browsers to send the session cookie only over encrypted HTTPS connections
# If a request is sent over plain HTTP, the browser strips the cookie out entirely, preventing network attackers from sniffing session keys in plain text
# For the case of plain fetch, one can use
# fetch('https://api.yourdomain.com/api/user', {
#     method: 'GET', 
#     credentials: 'include' //Attaches session cookies automatically
# })
# .then( r => r.json())
# .then(data => data)
# .catch(err => console.error(err))

# Access-Control-Allow-Origin header cannot be * but explicitly name the frontend domain
app.config.update(
    SESSION_COOKIE_SAMESITE='Lax', # Required for cross-domain fetch/axios requests  # SameSite=None if separate domains
    SESSION_COOKIE_SECURE=True  # MANDATORY by browsers when SameSite="None"
)

# On the frontend, your fetch calls must include credentials: 'include' or Axios must use withCredentials: true for the browser to send and receive the cookie




@app.route('/')
def index():
    return render_template("index.html")

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")