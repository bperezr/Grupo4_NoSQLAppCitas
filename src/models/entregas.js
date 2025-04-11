const mongoose = require('mongoose');
const {Schema} = mongoose;

const entregaSchema = new Schema({
  recetaId: { type: Schema.Types.ObjectId, ref: 'Receta', required: true },
  medicamentoId: { type: Schema.Types.ObjectId, ref: 'Medicamento', required: true },
  cantidadEntregada: { type: Number, required: true, min: 1 },
  fechaEntrega: { type: Date, required: true },
  entregadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const Entrega = mongoose.model('Entrega', entregaSchema);

module.exports = {
  Entrega
}; 