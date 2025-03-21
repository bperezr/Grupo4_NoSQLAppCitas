const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    citaId: { type: mongoose.Schema.Types.ObjectId },
    pacienteId: { type: mongoose.Schema.Types.ObjectId },
    monto: { type: Number },
    fechaPago: { type: Date },
    estado: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pagos', pagoSchema, 'Pagos');