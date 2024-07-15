from flask import Blueprint, request, jsonify
from .db import get_db

compte_bp = Blueprint('compte', __name__)

@compte_bp.route('/' , methods=['GET'])
def get_compte():

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM compte"
    cursor.execute(query)
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(results), 200
