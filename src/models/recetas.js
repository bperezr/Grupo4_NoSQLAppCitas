const mongoose = require('mongoose');
const {Schema} = mongoose;

const recetaSchema = new Schema({
    pacienteId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    sucursalId: { type: Schema.Types.ObjectId, ref: 'Sucursal', required: true },
    fechaEntrega: { type: Date, required: true },
    estado: { type: String, required: true, enum: ["Pendiente", "Entregado", "Cancelado"] },
    medicamentos: [{
      medicamentoId: { type: Schema.Types.ObjectId, ref: 'Medicamento', required: true },
      cantidad: { type: Number, required: true, min: 1 }
    }],
    notas: { type: String }
  });

module.exports = mongoose.model('Receta', recetaSchema);