from flask import Flask
from flask_cors import CORS
from bleuprints.test import compte_bp
from bleuprints.SaisitControler import saisit_bp
from bleuprints.CalculControler import calcul_bp
from bleuprints.OperatorControler import operator_bp
from bleuprints.EcritControler import ecrit_bp
from bleuprints.ParametreControler import param_bp

app = Flask(__name__)
CORS(app)

# Enregistrement des blueprints
app.register_blueprint(compte_bp, url_prefix='/compte')
app.register_blueprint(saisit_bp, url_prefix='/saisit')
app.register_blueprint(calcul_bp, url_prefix='/calcul')
app.register_blueprint(operator_bp, url_prefix='/operator')
app.register_blueprint(ecrit_bp, url_prefix='/ecrit')
app.register_blueprint(param_bp, url_prefix='/param')

@app.route('/')
def index():
    return "Connected!"

if __name__ == "__main__":
    app.run(debug=True)
