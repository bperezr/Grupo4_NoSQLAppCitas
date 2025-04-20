const mongoose = require('mongoose');
const Receta = require('../models/recetas');
const BitacoraUso = require('../models/bitacoraUso');

exports.crear = async (req, res) => {
  try {
    const { pacienteId, doctorId, sucursalId, notas, citaId } = req.body;
    let medicamentosRaw = req.body.medicamentos;

    if (!medicamentosRaw) {
      return res.status(400).json({ error: 'Debe incluir al menos un medicamento.' });
    }

    if (!Array.isArray(medicamentosRaw)) {
      medicamentosRaw = [medicamentosRaw];
    }

    const medicamentosProcesados = medicamentosRaw.map((med) => ({
      medicamentoId: new mongoose.Types.ObjectId(med.medicamentoId),
      cantidad: parseInt(med.cantidad)
    }));

    const recetaData = {
      pacienteId: new mongoose.Types.ObjectId(pacienteId),
      doctorId: new mongoose.Types.ObjectId(doctorId),
      sucursalId: new mongoose.Types.ObjectId(sucursalId),
      medicamentos: medicamentosProcesados,
      fechaEntrega: new Date(),
      estado: 'Pendiente',
      notas: notas || ''
    };

    if (citaId) {
      recetaData.citaId = new mongoose.Types.ObjectId(citaId);
    }

    const nuevaReceta = new Receta(recetaData);
    const recetaGuardada = await nuevaReceta.save();

    await new BitacoraUso({
      usuarioId: req.session.usuario.id,
      tipoAccion: `Creó una receta para el paciente ${pacienteId}`,
      fechaHora: new Date()
    }).save();

    return res.json({ ok: true, receta: recetaGuardada });

  } catch (error) {
    console.error('❌ Error al crear receta JSON:', error);
    return res.status(500).json({ error: 'Error al crear la receta' });
  }
};