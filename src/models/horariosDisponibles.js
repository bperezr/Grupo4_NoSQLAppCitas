const mongoose = require('mongoose');

const horarioDisponibleSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId },
    fecha: { type: Date },
    horaInicio: { type: String },
    horaFin: { type: String },
    disponible: { type: Boolean }
}, { timestamps: true });

module.exports = mongoose.model('HorariosDisponibles', horarioDisponibleSchema, 'HorariosDisponibles');