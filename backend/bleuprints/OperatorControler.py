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
            SELECT NomUnity,UnityID from Unity where UnityID IN ( SELECT unity.UnityID FROM USINE JOIN UNITY JOIN Operateur WHERE operateur.OperateurID = %s
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


@operator_bp.route('/addUnity', methods=['POST'])
def add_unity(usine_id):
    data = request.get_json()
    username = data.get('UnityID')
    email = data.get('NomUnity')
    operateur_id=data.get('Typ')
    password = generate_password_hash("Yusra")
    #HADI TWELI RANDOM
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'INSERT INTO users (username, email, pas, rol, OperateurID) VALUES (%s, %s, %s,"moderator", %s)'
        cursor.execute(query, (username, email, password, operateur_id))
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "User created successfully"}), 201
