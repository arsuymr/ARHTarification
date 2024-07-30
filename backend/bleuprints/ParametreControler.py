from flask import Blueprint, request, jsonify
from .db import get_db

param_bp = Blueprint('param', __name__)

@param_bp.route('/', methods=['GET'])
def get_params():
    conn = None
    cursor = None
    try:
        conn = get_db()
        UnityID = request.args.get('UnityID', None)
        cursor = conn.cursor(dictionary=True)
        query = '''
          SELECT codePO,valeur from prametreoperationel where UnityID=%s
        '''
        cursor.execute(query, (UnityID,))
        results = cursor.fetchall()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()



@param_bp.route('/set_param', methods=['Post'])
def set_param():
    conn = None
    cursor = None
    try:
        conn = get_db()

        ValeurParam = request.json.get('ValeurParam', None)
        codeParam = request.json.get('codeParam', None)
        cursor = conn.cursor(dictionary=True)
        print(ValeurParam,codeParam)
        if ([codeParam , ValeurParam] is not None):    
            query = """
                UPDATE Parametres 
                SET valeur = %s 
                WHERE codeParam = %s
            """
            cursor.execute(query, (ValeurParam, codeParam))
            conn.commit()
            return jsonify({"message":"Parametre Updated"}), 200
        else:
            return jsonify({"message":"faites entrer tout les champs"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()




@param_bp.route('/set_ParamOp', methods=['Post'])
def set_paramOp():
    conn = None
    cursor = None
    try:
        conn = get_db()
        ValeurParam = request.json.get('ValeurParam', None)
        codeParam = request.json.get('codeParam', None)
        UnityID = request.json.get('UnityID', None)
        cursor = conn.cursor(dictionary=True)
        if ([codeParam , ValeurParam] is not None):    
            query = """
                UPDATE PrametreOperationel 
                SET valeur = %s 
                WHERE codePO = %s AND UnityID=%s
            """
            cursor.execute(query, (ValeurParam, codeParam,UnityID))
            conn.commit()
            return jsonify({"message":"Parametre Updated"}), 200
        else:
            return jsonify({"message":"faites entrer tout les champs"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()