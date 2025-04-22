const mongoose = require('mongoose');

const bitacoraSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, required: true },
    fechaHora: { type: Date, required: true },
    tipoAccion: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BitacoraUso', bitacoraSchema, 'BitacoraUso');