from flask import Blueprint, request, jsonify
from .db import get_db

ecrit_bp = Blueprint('ecrit', __name__)

@ecrit_bp.route('/', methods=['GET'])
def get_ecrit():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    query = '''
        SELECT * FROM ecrit
        
    '''
    cursor.execute(query)
    results = cursor.fetchall()
    return jsonify(results), 200

