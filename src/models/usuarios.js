const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    email: { type: String },
    contraseña: { type: String },
    rol: { type: String },
    especialidad: { type: String },
    estado: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Usuarios', usuarioSchema, 'Usuarios');