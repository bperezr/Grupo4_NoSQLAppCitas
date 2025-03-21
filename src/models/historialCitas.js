const mongoose = require('mongoose');

const historialCitaSchema = new mongoose.Schema({
    citaId: { type: mongoose.Schema.Types.ObjectId },
    modificadoPor: { type: mongoose.Schema.Types.ObjectId },
    fechaModificacion: { type: Date },
    cambioRealizado: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HistorialCitas', historialCitaSchema, 'HistorialCitas');