const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    nombre: { type: String },
    apellido: { type: String },
    email: { type: String },
    especialidad: { type: String },
    horarioAtencion: { type: String },
    sucursalId: { type: mongoose.Schema.Types.ObjectId },
    estado: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctores', doctorSchema, 'Doctores');