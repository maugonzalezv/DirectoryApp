#Estructura de datos
contacts_storage = []
next_id = 1

def get_all():
    """Devuelve todos los contactos"""
    return contacts_storage

def get_one(contact_id):
    """Devuelve un contacto especifico por ID"""
    for contact in contacts_storage:
        if contact['id'] == contact_id:
            return contact
    return None

def create(data):
    """Crea un nuevo contacto con ID unico"""
    global next_id
    
    #Crear nuevo contacto
    new_contact = {
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
    
    contacts_storage.append(new_contact)
    next_id += 1
    
    return new_contact

def update(contact_id, data):
    """Actualiza un contacto existente"""
    contact = get_one(contact_id)
    if not contact:
        return None
    
     #Actualizar contacto
    contact['nombre'] = data.get('nombre', contact['nombre'])
    contact['apellido'] = data.get('apellido', contact['apellido'])
    contact['telefono'] = data.get('telefono', contact['telefono'])
    contact['correo_electronico'] = data.get('correo_electronico', contact['correo_electronico'])
    contact['calle'] = data.get('calle', contact['calle'])
    contact['ciudad'] = data.get('ciudad', contact['ciudad'])
    contact['estado'] = data.get('estado', contact['estado'])
    contact['empresa'] = data.get('empresa', contact['empresa'])
    contact['cargo'] = data.get('cargo', contact['cargo'])
    contact['notas'] = data.get('notas', contact['notas'])
    contact['fecha_cumpleanos'] = data.get('fecha_cumpleanos', contact['fecha_cumpleanos'])
    
    return contact

def delete(contact_id):
    """Elimina un contacto"""
    global contacts_storage
    contact = get_one(contact_id)
    if not contact:
        return False
    
    contacts_storage = [c for c in contacts_storage if c['id'] != contact_id]
    return True 