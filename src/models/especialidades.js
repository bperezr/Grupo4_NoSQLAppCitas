const mongoose = require('mongoose');

const especialidadSchema = new mongoose.Schema({
    nombreEspecialidad: { type: String, required: true, unique: true },
    descripcion: { type: String },
    precioConsulta: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Especialidades', especialidadSchema, 'Especialidades');