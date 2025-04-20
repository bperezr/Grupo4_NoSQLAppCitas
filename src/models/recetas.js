const mongoose = require('mongoose');
const { Schema } = mongoose;

const recetaSchema = new Schema({
  pacienteId: {
    type: Schema.Types.ObjectId,
    ref: 'Pacientes',
    required: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'Doctores',
    required: true
  },
  sucursalId: {
    type: Schema.Types.ObjectId,
    ref: 'Sucursales',
    required: true
  },
  citaId: {
    type: Schema.Types.ObjectId,
    ref: 'Citas',
    required: true
  },
  fechaEntrega: {
    type: Date,
    required: true,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['Pendiente', 'Entregado', 'Cancelado'],
    required: true,
    default: 'Pendiente'
  },
  medicamentos: [{
    medicamentoId: {
      type: Schema.Types.ObjectId,
      ref: 'Medicamento',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  notas: {
    type: String
  }
});

module.exports = mongoose.model('Receta', recetaSchema, 'Recetas');