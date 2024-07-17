from flask import Blueprint, request, jsonify
from .db import get_db

operator_bp = Blueprint('operator', __name__)

@operator_bp.route('/<int:operateur_id>', methods=['GET'])
def get_usine(operateur_id):
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        query = '''
            SELECT NomUnity from Unity where UnityID IN ( SELECT unity.UnityID FROM USINE JOIN UNITY JOIN Operateur WHERE operateur.OperateurID = %s
            )
        '''
        cursor.execute(query, (operateur_id,))
        results = cursor.fetchall()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@operator_bp.route('/unity/<int:usine_id>', methods=['GET'])
def get_unity(usine_id):
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        query = '''
        SELECT NomUnity from Unity where UnityID IN ( SELECT unity.UnityID FROM USINE JOIN UNITY WHERE Usine.usineID = %s
            )
        '''
        cursor.execute(query, (usine_id,))
        results = cursor.fetchall()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
