const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    especialidadId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Especialidades',
        required: true
    },
    sucursalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sucursales', required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios', required: true },
    horarioAtencion: { type: String },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

doctorSchema.index({ especialidadId: 1 });
doctorSchema.index({ sucursalId: 1 });
doctorSchema.index({ especialidadId: 1, sucursalId: 1 });

module.exports = mongoose.model('Doctores', doctorSchema, 'Doctores');
