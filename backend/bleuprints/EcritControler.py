from flask import Blueprint, request, jsonify
from .db import get_db

ecrit_bp = Blueprint('ecrit', __name__)

@ecrit_bp.route('/', methods=['GET'])
def get_ecrit():
    conn = None
    cursor = None
    try:
        conn = get_db()
        OperateurID = request.args.get('OperateurID', None)
        cursor = conn.cursor(dictionary=True)
        query = '''
            SELECT lien, date,description FROM ecrit WHERE operateurID=%s
        '''
        cursor.execute(query, (OperateurID,))
        results = cursor.fetchall()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
