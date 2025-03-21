const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    nombre: { type: String },
    apellido: { type: String },
    email: { type: String },
    telefono: { type: String },
    direccion: { type: String },
    fechaNacimiento: { type: Date },
    historialMedico: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pacientes', pacienteSchema, 'Pacientes');