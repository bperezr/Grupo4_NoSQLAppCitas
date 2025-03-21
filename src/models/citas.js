const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
    pacienteId: { type: mongoose.Schema.Types.ObjectId },
    doctorId: { type: mongoose.Schema.Types.ObjectId },
    fechaHora: { type: Date },
    estado: { type: String },
    motivo: { type: String },
    notas: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Citas', citaSchema, 'Citas', );