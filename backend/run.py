from flask import Flask
from bleuprints.test import compte_bp

app = Flask(__name__)


# Enregistrer le blueprint des routes
app.register_blueprint(compte_bp,url_prefix='/compte')

@app.route('/')
def index():
    return "connencted!"

if __name__ == "__main__":
    app.run(debug=True)
