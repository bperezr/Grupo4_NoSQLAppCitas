const mongoose = require('mongoose');

const farmaceuticoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, match: /^.+@.+\..+$/, unique: true },
    telefono: { type: String },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    sucursalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursal', required: true },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

module.exports = mongoose.model('Farmaceuticos', farmaceuticoSchema, 'Farmaceuticos');