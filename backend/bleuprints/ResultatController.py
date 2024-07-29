from flask import Blueprint, request, jsonify
from .db import get_db
from .CalculControler import Tarif_liquefaction_separation
Resultat_bp = Blueprint('resultat', __name__)

@Resultat_bp.route("get_param",methods=["GET"])
def get_param():

    conn = get_db()
    cursor = conn.cursor(dictionary = True)

    get_params_query = "SELECT * FROM Parametres"
    cursor.execute(get_params_query)
    params = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(params)

@Resultat_bp.route("/Simulation", methods=["GET"])
def Simulation():

   try:
        # Récupérer les paramètres de la requête
        NomParametre = request.args.get("NomParametre", None)
        ValeurParam = request.args.get("ValeurParam", None)
        AnneeActuelle = request.args.get('AnneeActuelle', None)
        OperateurID = request.args.get('OperateurID', None)
        # Connexion à la base de données
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        if ([NomParametre , ValeurParam] is not None):    
            query = """
                UPDATE Parametres 
                SET valeur = %s 
                WHERE codeParam = %s
            """
            cursor.execute(query, (ValeurParam, NomParametre))
            conn.commit()
        
        units_query = """
            SELECT Unity.UnityID
            FROM Unity
            JOIN Usine ON Unity.UsineID = Usine.UsineID
            JOIN Posseder ON Usine.UsineID = Posseder.UsineID
            WHERE Posseder.OperateurID = %s AND Posseder.Activ = 1
        """
        cursor.execute(units_query, (OperateurID,))
        units = cursor.fetchall()

        if not units:
            return jsonify({'message': 'No units found for the specified operator'}), 404

        # Boucler sur chaque unité pour vérifier si elle est valide pour l'année actuelle
        for unit in units:
            UnityID = unit['UnityID']
            
            recent_cc_query = """
                SELECT valide
                FROM ControleCout
                WHERE UnityID = %s AND AnneeActuelle = %s
            """
            cursor.execute(recent_cc_query, (UnityID, AnneeActuelle))
            recent_cc_result = cursor.fetchone()

            if not recent_cc_result or not recent_cc_result['valide']:
                # Si une unité n'est pas valide, renvoyer un message d'erreur
                cursor.close()
                conn.close()
                return jsonify({'message': f'Unit {UnityID} is not valid for the year {AnneeActuelle}'}), 400


        # Fermer la connexion
        cursor.close()
        conn.close()

        # Obtenir les résultats
        result = Tarif_liquefaction_separation(OperateurID, AnneeActuelle)
        return result

   except Exception as e:
    raise e


@Resultat_bp.route("/ValiderSimulation", methods=["POST"])
def ValiderSimulation():
    data = request.json
    AnneeActuelle = data.get('AnneeActuelle')
    NomUnity = data.get('NomUnity')
    OperateurID = data.get('OperateurID')
    tarif_L = data.get('tarif_L')
    tarif_S = data.get('tarif_S')
    creu_results = data.get('creu_results', [])

    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Set transaction isolation level to READ COMMITTED
        cursor.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED")

        # Start a new transaction
        conn.start_transaction()

        # Récupérer l'ID de la classe "Tarifs"
        query = """SELECT ID FROM CLasse WHERE NomClasse = 'Tarifs' """
        cursor.execute(query)
        result = cursor.fetchone()
        IDClasse = result['ID'] if result else None
        
        query = """SELECT UnityID, UsineID FROM Unity WHERE NomUnity = %s"""
        cursor.execute(query, (NomUnity,))
        result = cursor.fetchone()
        UnityID = result['UnityID'] if result else None
        UsineID = result['UsineID'] if result else None
        
        if not IDClasse:
            return jsonify({'error': 'Class "Tarifs" not found in database'}), 404
        
        # Insérer les résultats des tarifs liquifaction et separation
        query = """
        INSERT INTO Resultat (AnneeActuelle, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (AnneeActuelle, UnityID, UsineID, OperateurID, IDClasse, "Tarif_L", tarif_L))
        cursor.execute(query, (AnneeActuelle, UnityID, UsineID, OperateurID, IDClasse, "Tarif_S", tarif_S))

        # Insérer les résultats de CREU
        query = """SELECT ID FROM CLasse WHERE NomClasse = 'CREU' """
        cursor.execute(query)
        result = cursor.fetchone()
        IDClasse = result['ID'] if result else None
        print("creu", creu_results)
        for resultat in creu_results:
            print(resultat)
            query = """
            INSERT INTO Resultat (AnneeActuelle, UnityID, UsineID, OperateurID, IDClasse, codeSR, Valeur)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            if resultat['Type'] == "liquefaction" or resultat['Type'] =="liquefaction et separation":
                cursor.execute(query, (AnneeActuelle, UnityID, UsineID, OperateurID, IDClasse, "CREU_parTonne_L", resultat['CREU_parTonne']))
                cursor.execute(query, (AnneeActuelle, UnityID, UsineID, OperateurID, IDClasse, "CREU_parsm3_L", resultat['CREU_parsm3']))
            if resultat['Type'] == "separation" or resultat['Type'] =="liquefaction et separation":
                cursor.execute(query, (AnneeActuelle, UnityID, UsineID, OperateurID, IDClasse, "CREU_parTonne_S", resultat['CREU_parTonne']))
                cursor.execute(query, (AnneeActuelle, UnityID, UsineID, OperateurID, IDClasse, "CREU_parsm3_S", resultat['CREU_parsm3']))
        conn.commit()
    except OSError as e:
        print(f"An error occurred: {e}")
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({'message': 'Simulation validated and saved successfully'})




@Resultat_bp.route("/Stats", methods=["POST"])
def stats():
    NomUnity = request.json.get('NomUnity', None)
    AnneeDebut = request.json.get('AnneeDebut', None)
    OperateurNom = request.json.get('OperateurNom', None)
    Type = request.json.get('Type', None)  # 'tarif' ou 'creu'
    Limit = request.json.get('Limit', None)  # Limite de résultats
    # Vérifier que UnityID est fourni si Type est "creu"
    if Type == "creu" and not NomUnity:
        return jsonify({"error": "UnityID is required when Type is 'creu'"}), 400
    
    # Connexion à la base de données
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    AnneeFin = int(AnneeDebut) + int(Limit) - 1

    # Construire la requête SQL
    query = "SELECT Valeur, CodeSR , AnneeActuelle FROM Resultat "
    params = []
    if Type:
        print(Type)
        query +=  """
            WHERE IDClasse IN (
                SELECT ID FROM Classe WHERE NomClasse = %s
            )
        """
        params.append(Type)
    if NomUnity :
        query +=  """
            AND UnityID IN (
                SELECT UnityID FROM Unity WHERE NomUnity = %s
            )
        """
        print("hellooo")

        params.append(NomUnity)
    if AnneeDebut:
        query += " AND AnneeActuelle >= %s"
        params.append(AnneeDebut)

    if OperateurNom:
        query += """
            AND OperateurID IN (
                SELECT OperateurID FROM Operateur WHERE Nom_operateur = %s
            )
        """
        params.append(OperateurNom)
    
    if AnneeFin:
        query += " AND AnneeActuelle <= %s"
        params.append(AnneeFin)

    cursor.execute(query, params)
    results = cursor.fetchall()

    grouped_results = {}
    for code_sr in {row['CodeSR'] for row in results}:  # Inclure tous les CodeSR possibles
        grouped_results[code_sr] = {
            "annees": list(range(int(AnneeDebut), AnneeFin + 1)),
            "valeurs": [None] * int(Limit)  # Initialiser avec des None
        }

    for row in results:
        code_sr = row['CodeSR']
        annee_index = row['AnneeActuelle'] - int(AnneeDebut)
        if code_sr in grouped_results and 0 <= annee_index < int(Limit):
            grouped_results[code_sr]["valeurs"][annee_index] = row['Valeur']

    print("param", params)
    cursor.close()
    conn.close()

    return jsonify(grouped_results)

