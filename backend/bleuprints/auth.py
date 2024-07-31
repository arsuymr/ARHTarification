from werkzeug.security import check_password_hash, generate_password_hash
from flask import Blueprint, request, jsonify, session,current_app
from .db import get_db
import logging
from flask_mail import  Message
import secrets
import string
import random

users_bp = Blueprint('users', __name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
    
    session['user_id'] = user['UserID']
    session['role'] = user['rol']
    session['operator_id'] = user['OperateurID']
    
    return jsonify({
        "message": "Login successful",
        "rol": user['rol'],
        "OperateurID": user['OperateurID'],
        "UserID": user['UserID']
    }), 200



@users_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('id', None)
    session.pop('rol', None)
    return jsonify({"message": "Logout successful"}), 200


def generate_random_password(length=10):
    characters = string.ascii_letters + string.digits
    password = ''.join(random.choice(characters) for i in range(length))
    return password

def send_email(subject, recipient, body):
    msg = Message(subject, recipients=[recipient])
    msg.body = body
    mail = current_app.extensions.get('mail')
    mail.send(msg)

@users_bp.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    operateur_id = data.get('OperateurID')
    password = generate_random_password()
    hashed_password = generate_password_hash(password)

    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'INSERT INTO users (username, email, pas, rol, OperateurID) VALUES (%s, %s, %s, "moderator", %s)'
        cursor.execute(query, (username, email, hashed_password, operateur_id))
        conn.commit()
        send_email('Your New Account', email, f'Your password is: {password}')
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
    password = generate_random_password()
    hashed_password = generate_password_hash(password)

    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'INSERT INTO users (username, email, pas, rol) VALUES (%s, %s, %s, "moderator")'
        cursor.execute(query, (username, email, hashed_password))
        conn.commit()
        send_email('Your New Account', email, f'Your password is: {password}')
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
            "status_color": "green" if result[0] == "1" else "red",
            "username": result[1],
            "email": result[2]
        }
        moderators.append(moderator)

    return jsonify(moderators), 200


@users_bp.route('/get_modARH', methods=['GET'])
def get_modARH():
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = "SELECT statut, username, email FROM users WHERE users.OperateurID IS NULL AND users.rol = 'moderator';"
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
        statut = result[0]
        status_color = "red" if statut == "0" else "green"
        moderator = {
            "status_color": status_color,
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

@users_bp.route('/activate_account', methods=['POST'])
def activate_account():
    data = request.get_json()
    emails = data.get('emails')
    logger.info(f"Activating accounts for emails: {emails}")
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        # Generate a placeholder string for each email
        placeholders = ', '.join(['%s'] * len(emails))
        query = f'UPDATE users SET statut = 1 WHERE email IN ({placeholders})'
        cursor.execute(query, tuple(emails))
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        logger.error(f"Error activating accounts: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({"message": "Accounts activated successfully"}), 200

@users_bp.route('/deactivate_account', methods=['POST'])
def deactivate_account():
    data = request.get_json()
    emails = data.get('emails')
    logger.info(f"Deactivating accounts for emails: {emails}")
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        # Generate a placeholder string for each email
        placeholders = ', '.join(['%s'] * len(emails))
        query = f'UPDATE users SET statut = 0 WHERE email IN ({placeholders})'
        cursor.execute(query, tuple(emails))
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        logger.error(f"Error deactivating accounts: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({"message": "Accounts deactivated successfully"}), 200

@users_bp.route('/delete_account', methods=['POST'])
def delete_account():
    data = request.get_json()
    emails = data.get('emails')
    logger.info(f"Deleting accounts for emails: {emails}")
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        # Generate a placeholder string for each email
        placeholders = ', '.join(['%s'] * len(emails))
        query = f'DELETE FROM users WHERE email IN ({placeholders})'
        cursor.execute(query, tuple(emails))
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        logger.error(f"Error deleting accounts: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()
    return jsonify({"message": "Accounts deleted successfully"}), 200

@users_bp.route('/get_user', methods=['POST'])
def get_user():
    data = request.get_json()
    UserID = data.get('UserID')
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'SELECT Username, Email FROM users WHERE UserID=%s'
        cursor.execute(query, (UserID,))
        result = cursor.fetchone()  # Assuming UserID is unique and only one record will be returned
        conn.commit()
        if result:
            user = {
                "username": result[0],
                "email": result[1],
            }
        else:
            user = None
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404

@users_bp.route('/update_password', methods=['POST'])
def update_password():
    data = request.get_json()
    user_id = data.get('userID')
    previous_password = data.get('previous_password')
    new_password = data.get('password')
    
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        
        # Fetch the current password hash from the database
        query = 'SELECT pas FROM users WHERE UserID = %s'
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        
        if not result or not check_password_hash(result['pas'], previous_password):
            return jsonify({"error": "Previous password is incorrect"}), 400
        
        # Update the password
        hashed_password = generate_password_hash(new_password)
        update_query = 'UPDATE users SET pas = %s WHERE UserID = %s'
        cursor.execute(update_query, (hashed_password, user_id))
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
    
    return jsonify({"message": "Password updated successfully"}), 200