const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'doctor', 'paciente'], required: true },
    estado: { type: String, default: 'activo' },
    reinicioContraseña: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Usuarios', usuarioSchema, 'Usuarios');