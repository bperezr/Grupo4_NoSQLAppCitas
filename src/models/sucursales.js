const mongoose = require('mongoose');

const sucursalSchema = new mongoose.Schema({
    nombre: { type: String },
    direccion: { type: String },
    telefono: { type: String },
    horarioAtencion: { type: String },
    estado: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Sucursales', sucursalSchema, 'Sucursales');