const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    especialidad: { type: String, required: true },
    sucursalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales', required: true },
    horarioAtencion: { type: String },
    estado: { type: String, default: 'activo' }
}, { timestamps: true });

doctorSchema.index({ especialidad: 1, sucursalId: 1 });
module.exports = mongoose.model('Doctores', doctorSchema, 'Doctores');