const mongoose = require('mongoose');
const { Schema } = mongoose;

const pagoSchema = new Schema({
  citaId: {
    type: Schema.Types.ObjectId,
    ref: 'Citas',
    required: true
  },
  pacienteId: {
    type: Schema.Types.ObjectId,
    ref: 'Pacientes',
    required: true
  },
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  fechaPago: {
    type: Date,
    required: false
  },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'confirmado', 'cancelado', 'completado']
  }
}, { timestamps: true });


module.exports = mongoose.model('Pagos', pagoSchema, 'Pagos');