const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
    pacienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pacientes',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctores',
        required: true
    },
    especialidadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Especialidades',
        required: true
    },
    fechaHora: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
        required: true
    },
    motivo: {
        type: String
    },
    notas: {
        type: String
    },
    sucursalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sucursales'
    }
}, { timestamps: true });

module.exports = mongoose.model('Citas', citaSchema, 'Citas');