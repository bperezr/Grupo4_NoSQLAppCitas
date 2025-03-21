const mongoose = require('mongoose');

const especialidadSchema = new mongoose.Schema({
    nombreEspecialidad: { type: String },
    descripcion: { type: String },
    precioConsulta: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Especialidades', especialidadSchema, 'Especialidades');