import mysql.connector

# Configuration de la connexion à la base de données
db_config = {
    'user': 'root',
    'password': 'pass',
    'host': 'localhost',
    'database': 'arh',
    'raise_on_warnings': True
}

def get_db():
    return mysql.connector.connect(**db_config)
