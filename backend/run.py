from flask import Flask
from werkzeug.security import generate_password_hash
from flask_mail import Mail
from flask_cors import CORS
from bleuprints.test import compte_bp
from bleuprints.SaisitControler import saisit_bp
from bleuprints.CalculControler import calcul_bp
from bleuprints.OperatorControler import operator_bp
from bleuprints.EcritControler import ecrit_bp
from bleuprints.ParametreControler import param_bp
from bleuprints.auth import users_bp
from bleuprints.ResultatController import Resultat_bp


app = Flask(__name__)
app.secret_key = 'yz&_secret_key_here'
CORS(app)

# Enregistrement des blueprints
app.register_blueprint(compte_bp, url_prefix='/compte')
app.register_blueprint(saisit_bp, url_prefix='/saisit')
app.register_blueprint(calcul_bp, url_prefix='/calcul')
app.register_blueprint(operator_bp, url_prefix='/operator')
app.register_blueprint(ecrit_bp, url_prefix='/ecrit')
app.register_blueprint(param_bp, url_prefix='/param')
app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(Resultat_bp, url_prefix='/resultat')

# Flask-Mail configuration
# Configuration Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'aminatinhineneouadi@gmail.com'
app.config['MAIL_PASSWORD'] = 'sgrz ofxb phqs fprc'
app.config['MAIL_DEFAULT_SENDER'] = 'aminatinhineneouadi@gmail.com'

mail = Mail(app)


@app.route('/')
def index():
    return "Connected!"

if __name__ == "__main__":
    app.run(debug=True)
    
