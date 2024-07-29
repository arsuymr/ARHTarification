from werkzeug.security import check_password_hash, generate_password_hash
from flask import Blueprint, request, jsonify, session
from .db import get_db

users_bp = Blueprint('users', __name__)

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    pas = data.get('pas')  # Ensure 'pas' refers to the password field
    
    if not email or not pas:
        return jsonify({"error": "Email and password are required"}), 400
    
    try:
        conn = get_db()
        with conn.cursor(dictionary=True) as cursor:
            query = 'SELECT * FROM Users WHERE Email = %s'
            cursor.execute(query, (email,))
            user = cursor.fetchone()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    if not user or not check_password_hash(user['pas'], pas):  # Ensure 'pas' is the correct column
        return jsonify({"error": "Invalid email or password"}), 401
    
    session['user_id'] = user['Username']
    session['role'] = user['rol']
    session['operator_id'] = user['OperateurID']
    
    return jsonify({
        "message": "Login successful",
        "rol": user['rol'],
        "OperateurID": user['OperateurID']
    }), 200



@users_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('id', None)
    session.pop('rol', None)
    return jsonify({"message": "Logout successful"}), 200

@users_bp.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    operateur_id=data.get('OperateurID')
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

@users_bp.route('/create_userARH', methods=['POST'])
def create_userARH():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = generate_password_hash("Yusra")
    #HADI TWELI RANDOM
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'INSERT INTO users (username, email, pas, rol) VALUES (%s, %s, %s,"moderator", %s)'
        cursor.execute(query, (username, email, password))
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "User created successfully"}), 201

@users_bp.route('/get_mod', methods=['POST'])
def get_mod():
    data = request.get_json()
    operateur_id = data.get('OperateurID')
    print("piw ", operateur_id)
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'SELECT statut, username, email FROM users WHERE OperateurID=%s AND rol="moderator"'
        cursor.execute(query, (operateur_id,))
        results = cursor.fetchall()
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    # Transforming the results to a list of dictionaries
    moderators = []
    for result in results:
        moderator = {
            "status_color": "green" if result[0] == 1 else "red",
            "username": result[1],
            "email": result[2]
        }
        moderators.append(moderator)

    return jsonify(moderators), 200


@users_bp.route('/get_modARH', methods=['POST'])
def get_modARH():
    data = request.get_json()
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'SELECT statut, username, email FROM users WHERE OperateurID=NUMM AND rol="moderator"'
        cursor.execute(query)
        results = cursor.fetchall()
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    # Transforming the results to a list of dictionaries
    moderators = []
    for result in results:
        moderator = {
            "status_color": "green" if result[0] == 1 else "red",
            "username": result[1],
            "email": result[2]
        }
        moderators.append(moderator)

    return jsonify(moderators), 200



@users_bp.route('/CreateAdminARH', methods=['POST'])
def create_adminARH():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = generate_password_hash("Yusra")
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'INSERT INTO users (username, email, pas, rol) VALUES (%s, %s, %s,"admin")'
        cursor.execute(query, (username, email, password))
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "Admin ARH created successfully"}), 201

@users_bp.route('/CreateAdminOperator', methods=['POST'])
def create_adminOp():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    operator_id=data.get('OperateurID')
    #this must change
    password = generate_password_hash("Yusra")
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'INSERT INTO users (username, email, pas,rol,OperateurID) VALUES (%s, %s, %s,"admin",%s)'
        cursor.execute(query, (username, email, password,operator_id))
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "Admin Operateur crée avec succès"}), 201