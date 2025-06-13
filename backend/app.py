from flask import Flask, request, jsonify
from flask_cors import CORS
from contacts import get_all, get_one, create, update, delete

app = Flask(__name__)
CORS(app) 

#GET
@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    """Devuelve todos los contactos"""
    contacts = get_all()
    return jsonify(contacts), 200

#POST
@app.route('/api/contacts', methods=['POST'])
def create_contact():
    """Crea un nuevo contacto"""
    try:
        if not request.json:
            return jsonify({'error': 'Datos JSON requeridos'}), 400
        
        required_fields = ['nombre', 'apellido']
        for field in required_fields:
            if not request.json.get(field):
                return jsonify({'error': f'Campo {field} es obligatorio'}), 400
        
        new_contact = create(request.json)
        return jsonify(new_contact), 201
        
    except Exception as e:
        return jsonify({'error': 'Datos inválidos'}), 400

#GET
@app.route('/api/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    """Devuelve un contacto específico por ID"""
    contact = get_one(contact_id)
    if not contact:
        return jsonify({'error': 'Contacto no encontrado'}), 404
    
    return jsonify(contact), 200

#PATCH
@app.route('/api/contacts/<int:contact_id>', methods=['PATCH'])
def update_contact(contact_id):
    """Actualiza un contacto existente"""
    try:

        if not request.json:
            return jsonify({'error': 'Datos JSON requeridos'}), 400
        

        updated_contact = update(contact_id, request.json)
        if not updated_contact:
            return jsonify({'error': 'Contacto no encontrado'}), 404
        
        return jsonify(updated_contact), 200
        
    except Exception as e:
        return jsonify({'error': 'Datos invalidos'}), 400

#DELETE
@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """Elimina un contacto"""
    success = delete(contact_id)
    if not success:
        return jsonify({'error': 'Contacto no encontrado'}), 404
    
    return '', 204

#errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint no encontrado'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Método no permitido'}), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 