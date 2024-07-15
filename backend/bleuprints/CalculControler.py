from flask import Blueprint, request, jsonify
from .db import get_db

calcul_bp = Blueprint('calcul', __name__)


@calcul_bp.route('/', methods=['GET'])
def calcul_inv_actualisee():
    
    
    
    return








def calcul_Taux_Utulasation():

    data = request.json


    CCID = data.get("CCID",None)
    AnneeActuelle = data.get('AnneeActuelle', None)
    UnityID = data.get('UnityID', None)
    UsineID = data.get('UsineID', None)
    OperateurID = data.get('OperateurID', None)

    conn = get_db()
    cursor = conn.cursor(dictionary=True)


    query = "SELECT Valeur FROM saisit WHERE CCID=%s AND AnneeActuelle=%s AND UnityID=%s AND UsineID=%s AND OperateurID=%s AND codeSR='GNL' "
    cursor.execute(query, (CCID, AnneeActuelle, UnityID, UsineID, OperateurID))
    results = cursor.fetchall()

    # Stocker les valeurs dans un vecteur
    valeurs_gnl = [float(result['Valeur']) for result in results]
    

    query = "SELECT Capacite_design FROM Unity WHERE UnityID=%s "
    cursor.execute(query, (UnityID, ))
    Capacite_design_result = cursor.fetchone()

    if Capacite_design_result:
        Capacite_design = Capacite_design_result['Capacite_design']
    else:
        return jsonify({'error': 'No capacity design found for the given UnityID'}), 404

        # Diviser chaque élément du tableau 'valeurs_autre' par le vecteur 'taux_utilisation'
    taux_utilisation = [gnl/1000 / Capacite_design *100 for gnl in valeurs_gnl]

    # Retourner les résultats dans un tableau (JSON)
    response = {
        'taux_utilisation': taux_utilisation,
        'capacite de design': Capacite_design
    }

    return jsonify(response), 200

