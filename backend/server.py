#!/usr/bin/env python3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simple in-memory storage
contacts = []
next_id = 1

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    return jsonify(contacts), 200

@app.route('/api/contacts', methods=['POST'])
def create_contact():
    global next_id
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'JSON data required'}), 400
        
        if not data.get('nombre') or not data.get('apellido'):
            return jsonify({'error': 'First name and last name are required'}), 400
        
        contact = {
            'id': next_id,
            'nombre': data.get('nombre', ''),
            'apellido': data.get('apellido', ''),
            'telefono': data.get('telefono', ''),
            'correo_electronico': data.get('correo_electronico', ''),
            'calle': data.get('calle', ''),
            'ciudad': data.get('ciudad', ''),
            'estado': data.get('estado', ''),
            'empresa': data.get('empresa', ''),
            'cargo': data.get('cargo', ''),
            'notas': data.get('notas', ''),
            'fecha_cumpleanos': data.get('fecha_cumpleanos', '')
        }
        
        contacts.append(contact)
        next_id += 1
        
        print(f"Created contact: {contact}")
        return jsonify(contact), 201
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Invalid data'}), 400

@app.route('/api/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    contact = next((c for c in contacts if c['id'] == contact_id), None)
    if not contact:
        return jsonify({'error': 'Contact not found'}), 404
    return jsonify(contact), 200

@app.route('/api/contacts/<int:contact_id>', methods=['PATCH'])
def update_contact(contact_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'JSON data required'}), 400
        
        contact = next((c for c in contacts if c['id'] == contact_id), None)
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        # Update contact fields
        for key, value in data.items():
            if key in contact:
                contact[key] = value
        
        return jsonify(contact), 200
        
    except Exception as e:
        return jsonify({'error': 'Invalid data'}), 400

@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    global contacts
    contact = next((c for c in contacts if c['id'] == contact_id), None)
    if not contact:
        return jsonify({'error': 'Contact not found'}), 404
    
    contacts = [c for c in contacts if c['id'] != contact_id]
    return '', 204

if __name__ == '__main__':
    print("Starting Contact Directory Server...")
    print("Server will be available at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    app.run(debug=True, host='0.0.0.0', port=5000) 