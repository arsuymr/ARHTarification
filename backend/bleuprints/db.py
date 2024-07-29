# db.py
import mysql.connector
from mysql.connector import pooling

# Configuration de la connexion à la base de données
db_config = {
    'user': 'root',
    'password': 'yusra',
    'host': 'localhost',
    'database': 'arh',
    'raise_on_warnings': True
}

# Création du pool de connexions
pool = pooling.MySQLConnectionPool(pool_name="my_pool",
                                   pool_size=31,
                                   **db_config)

def get_db():
    """
    Fonction pour obtenir une connexion depuis le pool
    """
    try:
        return pool.get_connection()
    except mysql.connector.Error as err:
        print(f"Error getting database connection from pool: {err}")
        raise
