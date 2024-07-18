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
