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


@operator_bp.route('/add', methods=['POST'])
def add(usine_id):
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

@operator_bp.route('/<int:operateur_id>/usines', methods=['GET'])
def usine(operateur_id):
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        query = '''
           
            SELECT NomUsine, UsineID 
FROM Usine 
WHERE UsineID IN (
    SELECT Usine.UsineID 
    FROM Usine 
    JOIN Posseder ON Usine.UsineID = Posseder.UsineID 
    JOIN Operateur ON Posseder.OperateurID = Operateur.OperateurID 
    WHERE Operateur.OperateurID = %s AND Posseder.Activ=1
);
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


@operator_bp.route('/<int:usine_id>/units', methods=['GET'])
def unit(usine_id):
    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        query = '''SELECT NomUnity, UnityID FROM Unity WHERE UsineID = %s;'''
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
def add_unity():
    data = request.get_json()
    NomUnity= data.get('NomUnity')
    typ = data.get('typ')
    UsineID = data.get('UsineID')
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = 'INSERT INTO unity (NomUnity, UsineID , typ) VALUES (%s,%s,%s)'
        cursor.execute(query, (NomUnity,UsineID,typ))
        conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "Usine created successfully"}), 201




@operator_bp.route('/addUsine', methods=['POST'])
def add_usine():
    data = request.get_json()
    NomUsine = data.get('NomUsine')
    Wilaya = data.get('Wilaya')
    OperateurID = data.get('OperateurID')  # Make sure to include OperateurID in the request data

    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Insert into usine table
        query = 'INSERT INTO usine (NomUsine, Wilaya) VALUES (%s, %s)'
        cursor.execute(query, (NomUsine, Wilaya))
        conn.commit()
        
        # Retrieve the last inserted UsineID
        usine_id = cursor.lastrowid
        
        # Insert into POSSEDER table
        query_posseder = 'INSERT INTO POSSEDER (OperateurID, UsineID) VALUES (%s, %s)'
        cursor.execute(query_posseder, (OperateurID, usine_id))
        conn.commit()
    
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "Usine created successfully"}), 201

@operator_bp.route('/getInactiveUsines', methods=['POST'])
def get_inactive_usines():
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Query to get usines where posseder is inactive
        query = '''
        SELECT u.UsineID, u.NomUsine, u.Wilaya
        FROM usine u
        LEFT JOIN posseder p ON u.UsineID = p.UsineID
        WHERE p.UsineID IS NULL OR p.Activ = 0
        '''
        
        cursor.execute(query)
        usines = cursor.fetchall()
        
        # Convert result to list of dictionaries
        usines_list = [{'UsineID': usine[0], 'NomUsine': usine[1], 'Wilaya': usine[2]} for usine in usines]
    
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    return jsonify(usines_list), 200

@operator_bp.route('/acquisition', methods=['POST'])
def acquisition_usine():
    data = request.get_json()
    UsineID = data.get('UsineID')
    OperateurID = data.get('OperateurID')  # Make sure to include OperateurID in the request data
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Insert into usine table
        query = 'INSERT INTO Posseder (UsineID, OperateurID) VALUES (%s, %s)'
        cursor.execute(query, (UsineID, OperateurID))
        conn.commit()
        
    
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "Acquisition avec succès"}), 201

@operator_bp.route('/delete_usine', methods=['POST'])
def delete_usine():
    data = request.get_json()
    UsineID = data.get('UsineID')
    OperateurID = data.get('OperateurID')

    if not UsineID or not OperateurID:
        return jsonify({"error": "UsineID and OperateurID are required"}), 400

    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()

        # Update the existing entry to set Activ to 0
        update_query = 'UPDATE Posseder SET Activ = 0 WHERE UsineID = %s AND OperateurID = %s'
        cursor.execute(update_query, (UsineID, OperateurID))

        conn.commit()
    
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "Usine supprimée avec succès"}), 201
