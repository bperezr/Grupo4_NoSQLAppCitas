const mongoose = require('mongoose');

const horarioNoDisponibleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctores',
    required: true,
    description: 'Debe ser un ObjectId válido del doctor'
  },
  fecha: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
    description: 'Fecha en formato YYYY-MM-DD'
  },
  horaInicio: {
    type: String,
    required: true,
    match: /^\d{2}:\d{2}$/,
    description: 'Hora de inicio en formato HH:mm'
  },
  horaFin: {
    type: String,
    required: true,
    match: /^\d{2}:\d{2}$/,
    description: 'Hora de fin en formato HH:mm'
  },
  detalle: {
    type: String,
    default: null,
    description: 'Motivo del bloqueo (opcional)'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
    description: 'Fecha de creación del registro'
  }
}, {
  collection: 'HorariosNodisponibles'
});

module.exports = mongoose.model('HorariosNodisponibles', horarioNoDisponibleSchema);