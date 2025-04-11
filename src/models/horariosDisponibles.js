const mongoose = require('mongoose');

const horarioDisponibleSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctores', required: true },
  fecha: { type: Date, required: true },
  horaInicio: { type: Date, required: true },
  horaFin: { type: Date, required: true },
  disponible: { type: Boolean, required: true },
  sucursalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales', required: true },
  fechaHora: { type: Date, required: true }
});

module.exports = mongoose.model('HorariosDisponibles', horarioDisponibleSchema, 'HorariosDisponibles');