from flask import Blueprint, request, jsonify

compte_bp = Blueprint('compte', __name__)

@compte_bp.route('/')
def add_compte():
    response = {'message': 'Compte ajouté avec succès'}
    return jsonify(response), 201
