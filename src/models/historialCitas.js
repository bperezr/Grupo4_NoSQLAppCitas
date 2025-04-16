const mongoose = require('mongoose');

const historialCitaSchema = new mongoose.Schema({
    citaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Citas' },
    pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' },
    estado: { type: String, enum: ['pendiente', 'confirmado', 'atendido', 'cancelada'] },
    pago: { type: String, enum: ['pendiente', 'pagado'] },
}, { timestamps: true });

module.exports = mongoose.model('HistorialCitas', historialCitaSchema, 'HistorialCitas');
