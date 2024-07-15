from flask import Blueprint, request, jsonify
from .db import get_db

saisit_bp = Blueprint('saisit', __name__)

@saisit_bp.route('/', methods=['POST'])
def saisir_data():
    # Récupérer les données du formulaire ou de la requête JSON
    data = request.json
    
    # Valider les données (optionnel selon vos besoins)
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        # Extraire les champs nécessaires de l'objet JSON avec les types corrects
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
        if None in [AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur]:
            return jsonify({'error': 'Missing required fields or fields are None'}), 400
        
        # Convertir les champs à leurs types respectifs
        CCID = int(CCID) 
        IDClasse = int(IDClasse)
        Valeur = float(Valeur)   

        # Récupérer une connexion à la base de données
        conn = get_db()
        cursor = conn.cursor()

        # Générer la requête INSERT avec les valeurs converties
        query = """
        INSERT INTO Saisit (CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (CCID, AnneeActuelle, AnneePrevision, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur))
        
        # Commit des modifications dans la base de données
        conn.commit()

        # Réponse JSON pour indiquer le succès de l'opération
        response = {'message': 'Données saisies avec succès', 'data': data}
        return jsonify(response), 201
    except ValueError:
        return jsonify({'error': 'Invalid data type for IDClasse or Valeur'}), 400
    except Exception as e:
        # En cas d'erreur, annuler les modifications et renvoyer une erreur
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        # Fermeture du curseur et de la connexion dans tous les cas
        cursor.close()
        conn.close()


@saisit_bp.route('/get_privisions', methods=['GET'])
def get_saisit_data():

    data = request.json
    # Récupérer une connexion à la base de données
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    try:

 
        CCID = data.get('CCID', None)
        AnneeActuelle = data.get('AnneeActuelle', None)
        UnityID = data.get('UnityID', None)
        UsineID = data.get('UsineID', None)
        OperateurID = data.get('OperateurID', None)

        query = "SELECT valide FROM ControleCout WHERE CCID=%s"
        cursor.execute(query, (CCID))
        valide = cursor.fetchall() 


        # Exécuter la requête SELECT pour récupérer toutes les données de la table 'saisit'
        query = "SELECT * FROM saisit WHERE CCID=%s AND AnneeActuelle=%s AND UnityID=%s AND UsineID=%s AND OperateurID=%s"
        cursor.execute(query, (CCID, AnneeActuelle, UnityID, UsineID, OperateurID))
        results = cursor.fetchall()

        return jsonify(results), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Toujours fermer le curseur et la connexion à la base de données
        cursor.close()
        conn.close()

@saisit_bp.route('/get_classe', methods=['GET'])
def get_classe_SR():

    conn = get_db()
    cursor = conn.cursor(dictionary=True) 

    query = "SELECT c.NomClasse, GROUP_CONCAT(sr.NomSR ORDER BY sr.codeSR SEPARATOR ', ') AS SousRubriques FROM Classe c LEFT JOIN SousRebrique sr ON c.ID = sr.IDClasse GROUP BY c.ID, c.NomClasse"
    cursor.execute(query, )
    results = cursor.fetchall()

    return jsonify(results), 200
