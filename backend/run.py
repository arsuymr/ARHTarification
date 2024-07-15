from flask import Flask
from bleuprints.test import compte_bp
from bleuprints.SaisitControler import saisit_bp
from bleuprints.CalculControler import calcul_bp


app = Flask(__name__)


# Enregistrer le blueprint des routes
app.register_blueprint(compte_bp,url_prefix='/compte')
app.register_blueprint(saisit_bp,url_prefix='/saisit')
app.register_blueprint(calcul_bp,url_prefix='/calcul')

@app.route('/')
def index():
    return "connencted!"

if __name__ == "__main__":
    app.run(debug=True)
