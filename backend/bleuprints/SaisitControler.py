from flask import Blueprint, jsonify, request
from .db import get_db  # Importer la fonction get_db depuis le module principal
from flask import Flask
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
# Création du Blueprint
saisit_bp = Blueprint('saisit', __name__)

@saisit_bp.route('/get_classe', methods=['GET'])
def get_classe():
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT ID, NomClasse FROM Classe"
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@saisit_bp.route('/', methods=['POST'])
def insert_data():
    conn = None
    try:
        data = request.json
        # Extraire les données du JSON
        CCID = data.get('CCID', None)
        AnneeActuelle = data.get('AnneeActuelle', None)
        AnneePrevision = data.get('AnneePrevision', None)
        UnityID = data.get('UnityID', None)
        UsineID = data.get('UsineID', None)
        OperateurID = data.get('OperateurID', None)
        IDClasse = data.get('IDClasse', None)
        codeSR = data.get('codeSR', None)
        Valeur = data.get('Valeur', None)
        
        # Vérifier que les champs obligatoires sont présents et non vides
        if None in [CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur]:
            return jsonify({'error': 'Missing required fields or fields are None'}), 400
        
        # Convertir les champs à leurs types respectifs
        CCID = int(CCID)
        IDClasse = int(IDClasse)
        Valeur = float(Valeur)

        conn = get_db()
        cursor = conn.cursor()

        # Exécuter l'insertion dans la base de données
        query = """
        INSERT INTO Saisit (CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur))
        conn.commit()

        return jsonify({'message': 'Données insérées avec succès'}), 201
    except ValueError:
        return jsonify({'error': 'Invalid data type for IDClasse or Valeur'}), 400
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@saisit_bp.route('/get_all', methods=['GET'])
def get_all():
    conn = None
    try:
        IDClasse = request.args.get('IDClasse', None)
        AnneeActuelle = request.args.get('AnneeActuelle', None)
        AnneePrevision = request.args.get('AnneePrevision', None)
        UnityID = request.args.get('UnityID', None)
        CodeSR = request.args.get('CodeSR', None)

        # Vérification des paramètres obligatoires
        if None in [IDClasse, AnneeActuelle, AnneePrevision, UnityID, CodeSR]:
            return jsonify({'error': 'All parameters are required'}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT Valeur 
            FROM Saisit 
            WHERE AnneeActuelle = %s 
              AND AnneePrevision = %s 
              AND UnityID = %s 
              AND IDClasse = %s 
              AND CodeSR = %s
        """

        cursor.execute(query, (AnneeActuelle, AnneePrevision, UnityID, IDClasse, CodeSR))
        results = cursor.fetchall()
        
        return jsonify(results), 200

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@saisit_bp.route('/get_SR', methods=['GET'])
def get_SR():
    conn = None
    try:
        IDClasse = request.args.get('IDClasse', None)
        if IDClasse is None:
            return jsonify({'error': 'IDClasse is required'}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        query = """SELECT NomSR, codeSR FROM sousrebrique WHERE IDClasse = %s"""
        cursor.execute(query, (IDClasse,))
        results = cursor.fetchall()
        
        return jsonify(results), 200

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
