const mongoose = require('mongoose');
const { Schema } = mongoose;

const medicamentoSchema = new Schema({
  nombre: { type: String, required: true },
  marca: { type: String, required: true },
  tipo: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  unidad: { type: String, required: true },
  fechaIngreso: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true }
}, {
  collection: 'Medicamentos'  
});

module.exports = mongoose.model('Medicamento', medicamentoSchema);