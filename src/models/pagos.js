const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    citaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Citas' },
    pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' },
    monto: { type: Number },
    fechaPago: { type: Date },
    estado: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Pagos', pagoSchema, 'Pagos');