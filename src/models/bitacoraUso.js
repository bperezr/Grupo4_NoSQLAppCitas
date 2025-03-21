const mongoose = require('mongoose');

const bitacoraSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId },
    fechaHora: { type: Date },
    tipoAccion: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BitacoraUso', bitacoraSchema, 'BitacoraUso');