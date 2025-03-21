const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema({
    pacienteId: { type: mongoose.Schema.Types.ObjectId },
    doctorId: { type: mongoose.Schema.Types.ObjectId },
    medicamentos: [{ type: String }],
    indicaciones: { type: String },
    fechaEmision: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Recetas', recetaSchema, 'Recetas');