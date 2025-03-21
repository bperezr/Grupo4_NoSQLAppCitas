const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId },
    mensaje: { type: String },
    tipo: { type: String },
    fechaEnvio: { type: Date },
    leido: { type: Boolean }
}, { timestamps: true });

module.exports = mongoose.model('Notificaciones', notificacionSchema, 'Notificaciones');