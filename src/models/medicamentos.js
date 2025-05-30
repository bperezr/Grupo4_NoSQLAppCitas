const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicamentoSchema = new Schema({
  nombre: { type: String, required: true },
  marca: { type: String, required: true },
  tipo: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  unidad: { type: String, required: true },
  fechaIngreso: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
  sucursalId: {
    type: Schema.Types.ObjectId,
    ref: 'Sucursal',
    required: true
  }
});

medicamentoSchema.index({ sucursalId: 1 });
medicamentoSchema.index({ nombre: 1 });
medicamentoSchema.index({ activo: 1, tipo: 1 });

module.exports = mongoose.model('Medicamento', medicamentoSchema, 'Medicamentos');