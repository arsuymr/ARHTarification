from flask import Blueprint, request, jsonify
from .db import get_db

calcul_bp = Blueprint('calcul', __name__)


import math



@calcul_bp.route('/calculate_taux_utilisation', methods=['POST'])
def calculate_taux_utilisation():
    data = request.json
    CCID = data.get('CCID')
    AnneeActuelle = data.get('AnneeActuelle')
    UnityID = data.get('UnityID')
    OperateurID = data.get('OperateurID')
    n = data.get('n')

    conn = None
    cursor = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        
        # Récupération de UsineID
        query = "SELECT UsineID FROM Unity WHERE UnityID = %s"
        cursor.execute(query, (UnityID,))
        result = cursor.fetchone()
        UsineID = result['UsineID']
        
        # Vérification de la validité du ControleCout
        recent_cc_query = """
            SELECT valide
            FROM ControleCout
            WHERE UnityID = %s AND AnneeActuelle = %s
        """
        cursor.execute(recent_cc_query, (UnityID, AnneeActuelle))
        recent_cc_result = cursor.fetchone()
        
        if recent_cc_result is None:
            return jsonify({'message': f'Controle cout not found for the year {AnneeActuelle}'}), 404
        
        recent_cc_valid = recent_cc_result["valide"]
        
        if recent_cc_valid == 0:
            # Si le ControleCout n'est pas valide, renvoyer un message d'erreur
            return jsonify({'message': f'Le Controle cout n\'est pas valide pour l\'année {AnneeActuelle}'}), 400
        
        # Calcul du taux d'utilisation
        taux_utilisation = calcul_Taux_Utilisation(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, n)
        
        return jsonify({"valeur":taux_utilisation}), 200
    
    except mysql.connector.Error as e:
        # Gestion des erreurs de connexion à la base de données
        return jsonify({'message': f'Erreur de base de données : {str(e)}'}), 500
    
    finally:
        # Assurez-vous que le curseur et la connexion sont fermés
        if cursor:
            cursor.close()
        if conn:
            conn.close()




from flask import jsonify
import mysql.connector

def Tarif_liquefaction_separation(OperateurID, AnneeActuelle):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """SELECT UsineID FROM Posseder WHERE OperateurID = %s"""
        cursor.execute(query, (OperateurID,))
        usine_results = cursor.fetchall()

        if not usine_results:
            return jsonify({'error': 'Not found in usine table'}), 404

        somme_div_S= 0
        somme_div_L= 0
        tarif_liquefaction = 0
        tarif_separation = 0
        creu_results = []

        for usine in usine_results:
            usineid = usine['UsineID']

            query = """SELECT UnityID, Typ, NomUnity FROM Unity WHERE UsineID = %s"""
            cursor.execute(query, (usineid,))
            unity_results = cursor.fetchall()

            for unity in unity_results:
                unite = unity["UnityID"]
                typ = unity["Typ"]
                NomUnity = unity["NomUnity"]

                query = """SELECT Prevision, Id FROM ControleCout WHERE UnityID = %s AND AnneeActuelle = %s"""
                cursor.execute(query, (unite, AnneeActuelle))
                controle_cout_results = cursor.fetchall()

                for cc in controle_cout_results:
                    Nb_annee_prevision = cc["Prevision"]
                    CCID = cc["Id"]

                    query = """SELECT Valeur FROM Saisit WHERE UnityID = %s AND CCID = %s AND AnneeActuelle = %s AND UsineID = %s AND OperateurID = %s AND codeSR = 'QGA' AND IDClasse = '3'"""
                    cursor.execute(query, (unite, CCID, AnneeActuelle, usineid, OperateurID))
                    resultA = cursor.fetchall()
                    QGA = []
                    if resultA:
                        for result in resultA:
                            QGA.append(float(result['Valeur']))
                    else:
                        return jsonify({'error': 'Quantite Gaz Actualise doit etre entrer sinon c est la division par 0'}), 404
                    
                    query = """SELECT Valeur FROM Saisit WHERE UnityID = %s AND CCID = %s AND AnneeActuelle = %s AND UsineID = %s AND OperateurID = %s AND codeSR = 'PRP' AND IDClasse = '4'"""
                    cursor.execute(query, (unite, CCID, AnneeActuelle, usineid, OperateurID))
                    resultA = cursor.fetchall()
                    PRP = []
                    if resultA:
                        for result in resultA:
                            PRP.append(float(result['Valeur']))
                    else:
                        return jsonify({'error': 'les valeurs du propanes doivent etre entrer sinon c est la division par 0'}), 404
                    

                    query = """SELECT Valeur FROM Saisit WHERE UnityID = %s AND CCID = %s AND AnneeActuelle = %s AND UsineID = %s AND OperateurID = %s AND codeSR = 'BTN' AND IDClasse = '4'"""
                    cursor.execute(query, (unite, CCID, AnneeActuelle, usineid, OperateurID))
                    resultA = cursor.fetchall()
                    BTN = []
                    if resultA:
                        for result in resultA:
                            BTN.append(float(result['Valeur']))
                    else:
                        return jsonify({'error': 'les valeurs du Butane doivent etre entrer sinon c est la division par 0'}), 404
                    
                    
                    print("\n\n\n Type d'unite et le resultat creu ", typ,creu_results)


                    if typ in ["liquefaction", "liquefaction et separation"]:
                        sum_L = 0
                        sum_L = (sum(QGA) - QGA[0])
                        somme_div_L +=sum_L
                        creu = CREU_Unity(CCID, AnneeActuelle, unite, usineid, OperateurID, typ, Nb_annee_prevision, "liquefaction")
                        tarif_liquefaction += creu[0] * sum_L
                        print("Tarif Liquefaction --------------------", creu[0] * sum_L , tarif_liquefaction)
                        creu_results.append({
                            "NomUnity": NomUnity,
                            "Type": "liquefaction",
                            "CREU_parTonne": creu[1],
                            "CREU_parsm3": creu[0],
                        })


                    if typ in ["separation", "liquefaction et separation"]:
                        sum_S = 0
                        if typ =="separation":
                            sum_S = (sum(QGA) - QGA[0])*1000
                        else:
                            sum_S = sum(PRP) + sum(BTN) - PRP[0] - BTN[0]
                            print(sum_S)

                        somme_div_S +=sum_S
                        creu = CREU_Unity(CCID, AnneeActuelle, unite, usineid, OperateurID, typ, Nb_annee_prevision,"separation")
                        tarif_separation += creu[1] * sum_S
                        creu_results.append({
                            "NomUnity": NomUnity,
                            "Type": "separation",
                            "CREU_parTonne": creu[1],
                            "CREU_parsm3": creu[0],
                        })

        resultat_grouped = {}
        print(creu_results)
        for item in creu_results:
            nom_unity = item['NomUnity']
            if nom_unity not in resultat_grouped:
                resultat_grouped[nom_unity] = []
            resultat_grouped[nom_unity].append({
                "Type": item["Type"],
                "CREU_parTonne": item["CREU_parTonne"],
                "CREU_parsm3": item["CREU_parsm3"]
            })
        print("\n\n  Tarif liqui sepa ", tarif_liquefaction,tarif_separation)
        tarif_liquefaction = round(tarif_liquefaction / somme_div_L, 2) if somme_div_L else 0
        tarif_separation = round(tarif_separation / somme_div_S, 2) if somme_div_S else 0

        return jsonify({"tarif_L": tarif_liquefaction, "tarif_S": tarif_separation, "Resultat": resultat_grouped})
    
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': str(err)}), 500
    
    finally:
        cursor.close()
        conn.close()

    

def CREU_Unity(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, Type, n, typCalcul):


    inv_actualisee = calcul_Actualisee(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, Type, "Inv", n,typCalcul)   
    charge_exp_actualisee = calcul_Actualisee(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, Type, "CEXP", n,typCalcul)
    Auto_consom_Actualisee = Auto_consomation_Actualisee(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, Type, n,typCalcul)
    production_actualisee = Production_Actualisee(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, Type, n,typCalcul)

    print("inv_actualisee:", inv_actualisee)
    print("charge_exp_actualisee:", charge_exp_actualisee)
    print("Auto_consom_Actualisee:", Auto_consom_Actualisee)
    print("production_actualisee:", production_actualisee)

    result1 = sum( inv_actualisee + charge_exp_actualisee[1:] + Auto_consom_Actualisee)
    result4 = sum(production_actualisee)

    print("result1 (sum of inv_actualisee):", result1)
    print("result4 (sum of production_actualisee):", result4)

    CREU_tonne = round(result1 / result4, 2)

    print("CREU_tonne:", CREU_tonne)

    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT valeur FROM Parametres
        WHERE codeParam='CTGNL'
    """
    cursor.execute(query)
    result = cursor.fetchone()

    if result:
        convertion_TGNL = float(result['valeur'])
    else:
        cursor.close()
        return jsonify({'error': 'not found in parametre table'}), 404
    cursor.close()
    conn.close()

    CREU_sm3 = round(CREU_tonne / convertion_TGNL * 1000,2)
    return CREU_sm3, CREU_tonne 



def calcul_Actualisee(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, Type, param, n,typCalcul):
    
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT valeur FROM Parametres
        WHERE codeParam='FCU'
    """
    cursor.execute(query)
    facteur_corr_result = cursor.fetchone()

    if facteur_corr_result:
        FCU = float(facteur_corr_result['valeur'])
    else:
        cursor.close()
        return jsonify({'error': 'not found in parametre table'}), 404
    

    query= """
        SELECT valeur FROM Parametres
        WHERE codeParam='TA'
    """
    cursor.execute(query)
    result = cursor.fetchone()

    if result:
        TA = float(result['valeur'])
    else:
        cursor.close()
        return jsonify({'error': 'not found in parametre table'}), 404

    # Récupérer les valeurs de GNL, GZL, PRP et BTN depuis la table saisit
    codeSRs = ['GNL', 'GZL', 'PRP', 'BTN', param]
    valeurs = {codeSR: [] for codeSR in codeSRs}

    for codeSR in codeSRs:
        query = """
            SELECT Valeur FROM saisit
            WHERE CCID=%s AND AnneeActuelle=%s AND UnityID=%s AND UsineID=%s AND OperateurID=%s AND codeSR=%s  AND IDClasse IN (
          SELECT IDClasse 
          FROM SousRebrique 
          WHERE codeSR = %s
      )
        """
        cursor.execute(query, (CCID, AnneeActuelle, UnityID, UsineID, OperateurID, codeSR, codeSR))
        results = cursor.fetchall()
        valeurs[codeSR] = [float(result['Valeur']) for result in results if result['Valeur'] is not None]

    cursor.close()
    conn.close()

    calcul_intermediere = []
    Resultat_Actualisee = []
   
    if Type =="liquefaction":
        somme_production = [valeurs['GNL'][i] + valeurs['GZL'][i]  for i in range( len(valeurs['GNL']))]
    else:
        if Type == "separation":
            somme_production = [valeurs['PRP'][i] + valeurs['BTN'][i] for i in range( len(valeurs['PRP']))]
        else:
            somme_production = [valeurs['GNL'][i] + valeurs['GZL'][i] + valeurs['PRP'][i] + valeurs['BTN'][i] for i in range( len(valeurs['GNL']))]
   
    taux_utilisation = calcul_Taux_Utilisation(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, n)
 
    calcul_intermediere = [0] *n
    Resultat_Actualisee = [0] *n

    for i in range(n):
        if Type == "separation" or typCalcul=="separation":
            calcul_intermediere[i] = valeurs[param][i] * (valeurs['PRP'][i] + valeurs['BTN'][i]) / somme_production[i]
        else:
            calcul_intermediere[i] = valeurs[param][i]* valeurs['GNL'][i] / somme_production[i]

            
        if i == 0:
            if Type == "separation" or typCalcul=="separation":
                Resultat_Actualisee[i] =  valeurs[param][0]* (valeurs['PRP'][1] + valeurs['BTN'][1]) / somme_production[1]
                print("resuuultat actualisees ", Resultat_Actualisee[0])
            else : 
                Resultat_Actualisee[i] =  valeurs[param][0]* valeurs['GNL'][1] / somme_production[1]
        else:
           puissance = math.pow(1 + TA, i-1)
           if taux_utilisation[i] < FCU:
                Resultat_Actualisee[i] = ((calcul_intermediere[i] / puissance) * FCU)
           else:
                Resultat_Actualisee[i] = (calcul_intermediere[i] / puissance)

    return Resultat_Actualisee



def Auto_consomation_Actualisee(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, Type, n,typCalcul):
    
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT valeur FROM Parametres
        WHERE codeParam='TA'
    """
    cursor.execute(query)
    result = cursor.fetchone()

    if result:
        TA = float(result['valeur'])
    else:
        cursor.close()
        return jsonify({'error': 'not found in parametre table'}), 404


    query = """
        SELECT valeur FROM Parametres
        WHERE codeParam='DGN'
    """
    cursor.execute(query)
    result = cursor.fetchone()

    if result:
        DGN = float(result['valeur'])
    else:
        cursor.close()
        conn.close()
        return jsonify({'error': 'not found in parametre table'}), 404

    query= """
        SELECT valeur FROM Parametres
        WHERE codeParam='PGN'
    """
    cursor.execute(query)
    result = cursor.fetchone()

    if result:
        PGN = float(result['valeur'])
    else:
        cursor.close()
        conn.close()
        return jsonify({'error': 'not found in parametre table'}), 404

    # Récupérer les valeurs de GNL, GZL, PRP et BTN depuis la table saisit
    codeSRs = ['GNL', 'GZL', 'PRP', 'BTN',"TAC", "QGA","QGNC","FCNS"]
    valeurs = {codeSR: [] for codeSR in codeSRs}

    for codeSR in codeSRs:
        query = """
            SELECT Valeur FROM saisit
            WHERE CCID=%s AND AnneeActuelle=%s AND UnityID=%s AND UsineID=%s AND OperateurID=%s AND codeSR=%s  AND IDClasse IN (
          SELECT IDClasse 
          FROM SousRebrique 
          WHERE codeSR = %s
      )
        """
        cursor.execute(query, (CCID, AnneeActuelle, UnityID, UsineID, OperateurID, codeSR, codeSR))
        results = cursor.fetchall()
        valeurs[codeSR] = [float(result['Valeur']) for result in results if result['Valeur'] is not None]
    
    cursor.close()
    conn.close()

    calcul_intermediere = []

    if Type == "liquefaction":
        somme_production = [valeurs['GNL'][i] + valeurs['GZL'][i]  for i in range(n)]
    else:
        if Type=="separation":
            somme_production = [valeurs['PRP'][i] + valeurs['BTN'][i] for i in range(n)]
        else:
            somme_production = [valeurs['GNL'][i] + valeurs['GZL'][i] + valeurs['PRP'][i] + valeurs['BTN'][i] for i in range(n)]
  
    if Type == "liquefaction" or (Type == "liquefaction et separation" and typCalcul=="liquefaction"):
        calcul_intermediere = [valeurs["QGA"][i] * valeurs["TAC"][i] /100 * 1000000 * valeurs['GNL'][i] / somme_production[i] / DGN for i in range(n)]
    else: 
        if Type == "separation" :
            calcul_intermediere = [valeurs["QGNC"][i]*1000 * valeurs["FCNS"][1] for i in range( n)]
        else:
            if Type == "liquefaction et separation" and typCalcul=="separation":
                calcul_intermediere = [valeurs["QGA"][i] * valeurs["TAC"][i] /100 * 1000000 * (valeurs['PRP'][i] + valeurs['BTN'][i]) / somme_production[i] / DGN for i in range(n)]

    Puissance = [math.pow(1 + TA, i-1) for i in range(n) ]
    Autoconsomation_Actualise = [(calcul_intermediere[i] / Puissance[i] * PGN / 1000000 ) for i in range(1, n) ]

    return Autoconsomation_Actualise








def Production_Actualisee(CCID, AnneeActuelle, UnityID, UsineID, OperateurID, Type, n ,typCalcul):
    
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT valeur FROM Parametres
        WHERE codeParam='TA'
    """
    cursor.execute(query)
    result = cursor.fetchone()

    if result:
        TA = float(result['valeur'])
    else:
        cursor.close()
        return jsonify({'error': 'not found in parametre table'}), 404
    

    # Récupérer les valeurs de GNL, GZL, PRP et BTN depuis la table saisit
    codeSRs = ['GNL', 'GZL', 'PRP', 'BTN']
    valeurs = {codeSR: [] for codeSR in codeSRs}

    for codeSR in codeSRs:
        query = """
            SELECT Valeur FROM saisit
            WHERE CCID=%s AND AnneeActuelle=%s AND UnityID=%s AND UsineID=%s AND OperateurID=%s AND codeSR=%s  AND IDClasse IN (
          SELECT IDClasse 
          FROM SousRebrique 
          WHERE codeSR = %s
      )
        """
        cursor.execute(query, (CCID, AnneeActuelle, UnityID, UsineID, OperateurID, codeSR, codeSR))
        results = cursor.fetchall()
        valeurs[codeSR] = [float(result['Valeur']) for result in results if result['Valeur'] is not None]


    cursor.close()
    conn.close()
 
    Puissance = [math.pow(1 + TA, i-1) for i in range( n) ]

    if Type == "liquefaction" or (Type == "liquefaction et separation" and typCalcul=="liquefaction"):
        Peoduction_Actualisee = [(valeurs['GNL'][i] / Puissance[i]/ 1000) for i in range(1, n)]
    else: 
        Peoduction_Actualisee = [((valeurs['PRP'][i]+valeurs['BTN'][i]) / Puissance[i]/ 1000)  for i in  range(1, n)]

    return Peoduction_Actualisee




def calcul_Taux_Utilisation(CCID, AnneeActuelle, UnityID, UsineID, OperateurID,n):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)


    query = "SELECT Valeur FROM saisit WHERE CCID=%s AND AnneeActuelle=%s AND UnityID=%s AND UsineID=%s AND OperateurID=%s AND codeSR='GNL' AND IDClasse='4'"
    cursor.execute(query, (CCID, AnneeActuelle, UnityID, UsineID, OperateurID))
    results = cursor.fetchall()

    # Stocker les valeurs dans un vecteur
    valeurs_gnl = [float(result['Valeur']) for result in results]

    query = "SELECT valeur FROM PrametreOperationel WHERE UnityID=%s AND codePO='Capacite_design'"
    cursor.execute(query, (UnityID, ))
    Capacite_design_result = cursor.fetchone()

    if Capacite_design_result:
        Capacite_design = Capacite_design_result['valeur']
    else:
        return jsonify({'error': 'No capacity design found for the given UnityID'}), 404
        
    cursor.close()
    conn.close()
    # Diviser chaque élément du tableau 'valeurs_autre' par le vecteur 'taux_utilisation'
    taux_utilisation = [ (valeurs_gnl[i]/1000 / Capacite_design *100) for i in range(n)]


    return taux_utilisation