from flask import Blueprint, jsonify, request
from .db import get_db  
from flask import Flask
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import requests



saisit_bp = Blueprint('saisit', __name__)



@saisit_bp.route('/saisit', methods=['POST'])
def populate_saisit():
    try:
        data = request.json
        CCID = data.get('CCID')
        AnneeActuelle = data.get('AnneeActuelle')
        NombreAnnees = data.get('NombreAnnees')  # Nombre d'années de prévision
        UnityID = data.get('UnityID')
        UsineID = data.get('UsineID')
        OperateurID = data.get('OperateurID')
        Valeur = data.get('Valeur')
        
        # Vérifier que les champs obligatoires sont présents et non vides
        if None in [CCID, AnneeActuelle, NombreAnnees, UnityID, UsineID, OperateurID, Valeur]:
            return jsonify({'error': 'Missing required fields or fields are None'}), 400
        
        # Convertir les champs à leurs types respectifs
        CCID = int(CCID)
        Valeur = float(Valeur)
        NombreAnnees = int(NombreAnnees)
        
        # Obtenir toutes les classes
        response_classe = requests.get('http://127.0.0.1:5000/saisit/get_classe')
        if response_classe.status_code == 200:
            classes = response_classe.json()
        else:
            return jsonify({'error': response_classe.text}), 500

        for classe in classes:
            IDClasse = classe['ID']
            # Obtenir tous les codes SR pour la classe
            response_sr = requests.get(f'http://127.0.0.1:5000/saisit/get_SR?IDClasse={IDClasse}')
            if response_sr.status_code == 200:
                sous_rebriques = response_sr.json()
            else:
                return jsonify({'error': response_sr.text}), 500
            
            for sr in sous_rebriques:
                codeSR = sr['codeSR']
                
                for i in range(NombreAnnees):
                    AnneePrevision = AnneeActuelle + i
                    
                    insert_data_payload = {
                    'CCID': CCID,
                    'AnneeActuelle': AnneeActuelle,
                    'AnneePrevision': AnneePrevision,
                    'UnityID': UnityID,
                    'UsineID': UsineID,
                    'OperateurID': OperateurID,
                    'IDClasse': IDClasse,
                    'codeSR': codeSR,
                    'Valeur': Valeur}
                    print(insert_data_payload)
                    response_insert = requests.post('http://127.0.0.1:5000/saisit/', json=insert_data_payload)

                    print(response_insert)

        return jsonify({'message': 'Données insérées/mises à jour avec succès'}), 201

    except ValueError:
        return jsonify({'error': 'Invalid data type for IDClasse or Valeur'}), 400
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500


@saisit_bp.route('/get_classe', methods=['GET'])
def get_classe():
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT DISTINCT Classe.ID, Classe.NomClasse
            FROM Classe
            JOIN SousRebrique ON Classe.ID = SousRebrique.IDClasse
            WHERE SousRebrique.calcule = 0
            ORDER BY Classe.ID
        """
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@saisit_bp.route('/', methods=['POST'])
def insert_data():
    conn = None
    try:
        data = request.json
        CCID = data.get('CCID', None)
        AnneeActuelle = data.get('AnneeActuelle', None)
        AnneePrevision = data.get('AnneePrevision', None)
        UnityID = data.get('UnityID', None)
        UsineID = data.get('UsineID', None)
        OperateurID = data.get('OperateurID', None)
        IDClasse = data.get('IDClasse', None)
        codeSR = data.get('codeSR', None)
        Valeur = data.get('Valeur', None)
        print(data)
        # Vérifier que les champs obligatoires sont présents et non vides
        if None in [CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur]:
            return jsonify({'error': 'Missing required fields or fields are None'}), 400
        
        # Convertir les champs à leurs types respectifs
        CCID = int(CCID)
        IDClasse = int(IDClasse)
        Valeur = float(Valeur)

        conn = get_db()
        cursor = conn.cursor()

        # Vérifier si l'enregistrement existe déjà
        check_query = """
        SELECT COUNT(*) FROM Saisit 
        WHERE CCID = %s AND AnneeActuelle = %s AND AnneePrevision = %s AND UnityID = %s AND UsineID = %s AND OperateurID = %s AND IDClasse = %s AND codeSR = %s
        """
        cursor.execute(check_query, (CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR))
        result = cursor.fetchone()

        if result[0] > 0:
            # Mettre à jour l'enregistrement existant
            update_query = """
            UPDATE Saisit
            SET Valeur = %s
            WHERE CCID = %s AND AnneeActuelle = %s AND AnneePrevision = %s AND UnityID = %s AND UsineID = %s AND OperateurID = %s AND IDClasse = %s AND codeSR = %s
            """
            cursor.execute(update_query, (Valeur, CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR))
            message = 'Données mises à jour avec succès'
        else:
            # Insérer un nouvel enregistrement
            insert_query = """
            INSERT INTO Saisit (CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur))
            message = 'Données insérées avec succès'

        conn.commit()
        return jsonify({'message': message}), 201

    except ValueError:
        return jsonify({'error': 'Invalid data type for IDClasse or Valeur'}), 400
    except mysql.connector.Error as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@saisit_bp.route('/get_all', methods=['GET'])
def get_all():
    conn = None
    try:
        AnneeActuelle = request.args.get('AnneeActuelle', None)
        CCID = request.args.get('CCID', None)
        IDClasse = request.args.get('IDClasse', None)
        AnneePrevision = request.args.get('AnneePrevision', None)
        UnityID = request.args.get('UnityID', None)
        CodeSR = request.args.get('CodeSR', None)
        OperateurID = request.args.get('OperateurID', None)
        UsineID = request.args.get('UsineID', None)

        # Vérification des paramètres obligatoires
        if None in [IDClasse, AnneePrevision, UnityID, CodeSR, CCID]:
            return jsonify({'error': 'All parameters are required'}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)


        saisit_query = """
            SELECT * FROM Saisit AS S WHERE S.CCID = %s
              AND S.AnneePrevision = %s 
              AND S.UnityID = %s 
              AND S.IDClasse = %s 
              AND S.CodeSR = %s
              AND S.UsineID = %s
              AND s.AnneeActuelle =%s
              AND OperateurID = %s
        """

        cursor.execute(saisit_query, (CCID, AnneePrevision, UnityID, IDClasse, CodeSR, UsineID,AnneeActuelle,OperateurID))
        results = cursor.fetchall()
        if results:
            return jsonify({ 'data': results}), 200
        else:
            print(CCID,AnneePrevision, UnityID, IDClasse, CodeSR, UsineID)
            return jsonify({'data':"",'message': 'No data found for the most recent control '}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@saisit_bp.route('/get_all_valide', methods=['GET'])
def get_all_valide():
    try:
        CCID = request.args.get('CCID', None)
        IDClasse = request.args.get('IDClasse', None)
        AnneePrevision = request.args.get('AnneePrevision', None)
        UnityID = request.args.get('UnityID', None)
        CodeSR = request.args.get('CodeSR', None)
        AnneeActuelle = request.args.get('AnneeActuelle', None)

        # Vérification des paramètres obligatoires
        if None in [IDClasse, AnneePrevision, UnityID, CodeSR, CCID]:
            return jsonify({'error': 'All parameters are required'}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Trouver UsineID à partir de UnityID
        usine_query = """
            SELECT UsineID
            FROM Unity
            WHERE UnityID = %s
        """
        cursor.execute(usine_query, (UnityID,))
        usine_result = cursor.fetchone()
        
        if not usine_result:
            return jsonify({'message': 'No usine found for the given UnityID','valide':False}), 404
        
        UsineID = usine_result['UsineID']

        # Check if ControleCout is valid for the year
        recent_cc_query = """
                SELECT valide
                FROM ControleCout
                WHERE UnityID = %s AND AnneeActuelle = %s
            """
        cursor.execute(recent_cc_query, (UnityID, AnneeActuelle))
        recent_cc_result = cursor.fetchone()

        if not recent_cc_result or recent_cc_result["valide"]==0 :
            return jsonify({'message': f'le Controle cout is not valid for the year {AnneeActuelle}','valide':False}), 400

        # Récupérer toutes les saisies pour le contrôle de coût le plus récent avec UsineID
        saisit_query = """
            SELECT * FROM Saisit AS S WHERE S.CCID = %s
              AND S.AnneePrevision = %s 
              AND S.UnityID = %s 
              AND S.IDClasse = %s 
              AND S.CodeSR = %s
              AND S.UsineID = %s
        """

        cursor.execute(saisit_query, (CCID, AnneePrevision, UnityID, IDClasse, CodeSR, UsineID))
        results = cursor.fetchall()
        if results:
            return jsonify({ 'data': results,'valide':True}), 200
        else:
            return jsonify({'message': 'No data found for the control','valide':False}), 200

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
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
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@saisit_bp.route('/create_CC', methods=['POST'])
def create_CC():
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()

        data = request.json
        print("Requête JSON reçue:", data)

        AnneeActuelle = data.get('AnneeActuelle')
        UnityID = data.get('UnityID')
        Prevision = data.get('Prevision')

        # Vérifiez que tous les champs obligatoires sont présents
        if AnneeActuelle is None or UnityID is None or Prevision is None:
            return jsonify({'error': 'Les champs AnneeActuelle, UnityID et Prevision sont obligatoires'}), 400

        print("unity", UnityID)

        insert_query = """
            INSERT INTO ControleCout (AnneeActuelle, valide, UnityID, Prevision)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (AnneeActuelle, 0, UnityID, Prevision))

        conn.commit()
        message = 'Données insérées avec succès'
        print(message)

        return jsonify({'message': message}), 201

    except mysql.connector.Error as e:
        print("Erreur MySQL:", e)
        return jsonify({'error': str(e)}), 500

    except Exception as e:
        print("Erreur Exception:", e)
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@saisit_bp.route('/valides_CC', methods=['POST'])
def valider_CC():
    data = request.json
    CCID = data.get('CCID', None)

    # Vérifiez que le CCID est fourni
    if CCID is None:
        return jsonify({'error': 'CCID is required'}), 400

    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()

        update_query = """
            UPDATE ControleCout
            SET valide = '1'
            WHERE Id = %s
        """
        cursor.execute(update_query, (CCID,))

        # Valider les changements dans la base de données
        conn.commit()

        cursor.close()
        return jsonify({'message': "Controle Cout validé"}), 201
    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

           
@saisit_bp.route('/get_recent_CC', methods=['GET'])
def get_recent_CC():
    conn = None
    try:
        UnityID = request.args.get('UnityID', None)
        if UnityID is None:
            return jsonify({'error': 'UnityID is required'}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Requête pour obtenir le contrôle de coût le plus récent
        recent_cc_query = """
            SELECT Id, AnneeActuelle, Prevision, valide
            FROM ControleCout
            WHERE UnityID = %s
            ORDER BY AnneeActuelle DESC
            LIMIT 1
        """
        cursor.execute(recent_cc_query, (UnityID,))
        recent_cc_result = cursor.fetchone()

        if not recent_cc_result:
            return jsonify({'message': 'No recent control found'}), 404

        # Générer les années basées sur Prevision
        current_year = recent_cc_result['AnneeActuelle']
        prevision_years = list(range(current_year, current_year + recent_cc_result['Prevision']))

        units = """
            SELECT typ
            FROM Unity
            WHERE UnityID = %s
        """
        cursor.execute(units, (UnityID,))
        typ = cursor.fetchone()
        typ =typ["typ"]

        # Inclure les années dans la réponse
        response = {
            'CCID': recent_cc_result['Id'],
            'AnneeActuelle': recent_cc_result['AnneeActuelle'],
            'Prevision': recent_cc_result['Prevision'],
            'valide': recent_cc_result['valide'],
            'years': prevision_years, 
             "Type": typ
        }

        return jsonify(response), 200

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@saisit_bp.route('/get_CC', methods=['GET'])
def get_CC():
    conn = None
    try:
        UnityID = request.args.get('UnityID', None)
        AnneeActuelle = request.args.get('AnneeActuelle', None)
        if [UnityID,AnneeActuelle] is None:
            return jsonify({'error': 'UnityID et AnneeActuelle are required'}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Requête pour obtenir le contrôle de coût le plus récent
        recent_cc_query = """
            SELECT Id, Prevision, valide
            FROM ControleCout
            WHERE UnityID = %s AND AnneeActuelle=%s
        """
        cursor.execute(recent_cc_query, (UnityID,AnneeActuelle))
        recent_cc_result = cursor.fetchone()

        if not recent_cc_result:
            return jsonify({'error': 'No Controle cout control found'}), 404

        current_year = int(AnneeActuelle)
        prevision_years = list(range(current_year, current_year + recent_cc_result['Prevision']))

        # Inclure les années dans la réponse
        response = {
            'CCID': recent_cc_result['Id'],
            'Prevision': recent_cc_result['Prevision'],
            'valide': recent_cc_result['valide'],
            'years': prevision_years
        }

        return jsonify(response), 200

    except mysql.connector.Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

