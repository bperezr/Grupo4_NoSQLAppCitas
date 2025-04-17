const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    cedula: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/, lowercase: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    direccion: { type: String, default: '' },
    fechaNacimiento: { type: Date },
    historialMedico: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Pacientes', pacienteSchema, 'Pacientes');