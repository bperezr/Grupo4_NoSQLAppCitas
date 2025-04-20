const mongoose = require('mongoose');

const horarioNoDisponibleSchema = new mongoose.Schema({
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctores', 
    required: true 
  },
  fecha: { 
    type: Date, 
    required: true 
  },
  horaInicio: { 
    type: String, 
    required: true 
  },
  horaFin: { 
    type: String, 
    required: true 
  },
  detalle: { 
    type: String, 
    default: null 
  },
  fechaCreacion: { 
    type: Date, 
    required: true 
  }
}, { 
  timestamps: false 
});

module.exports = mongoose.model('HorariosNoDisponibles', horarioNoDisponibleSchema, 'HorariosNoDisponibles');
