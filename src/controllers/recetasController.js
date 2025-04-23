const mongoose = require('mongoose');
const Receta = require('../models/recetas');
const Medicamento = require('../models/medicamentos');
const BitacoraUso = require('../models/bitacoraUso');

exports.crear = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

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

    // Validar stock antes de continuar
    for (const item of medicamentosProcesados) {
      const medicamento = await Medicamento.findById(item.medicamentoId).session(session);
      if (!medicamento) {
        await session.abortTransaction();
        return res.status(404).json({ error: 'Medicamento no encontrado.' });
      }

      if (medicamento.stock < item.cantidad) {
        await session.abortTransaction();
        return res.status(400).json({ error: `Stock insuficiente para ${medicamento.nombre}. Disponible: ${medicamento.stock}, requerido: ${item.cantidad}` });
      }

      medicamento.stock -= item.cantidad;
      await medicamento.save({ session });
    }

    // Crear receta
    const recetaData = {
      pacienteId: new mongoose.Types.ObjectId(pacienteId),
      doctorId: new mongoose.Types.ObjectId(doctorId),
      sucursalId: new mongoose.Types.ObjectId(sucursalId),
      medicamentos: medicamentosProcesados,
      fechaCreacion: new Date(),
      estado: 'Pendiente',
      notas: notas || ''
    };

    if (citaId) {
      recetaData.citaId = new mongoose.Types.ObjectId(citaId);
    }

    const nuevaReceta = new Receta(recetaData);
    const recetaGuardada = await nuevaReceta.save({ session });

    // Bitácora
    await new BitacoraUso({
      usuarioId: req.session.usuario.id,
      tipoAccion: `Creó una receta para el paciente ${pacienteId}`,
      fechaHora: new Date()
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.json({ ok: true, receta: recetaGuardada });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('❌ Error al crear receta JSON:', error);
    return res.status(500).json({ error: 'Error al crear la receta' });
  }
};


exports.historialRecetas = async (req, res) => {
  try {
    const Receta = require('../models/recetas');
    const Cita = require('../models/citas');

    const recetas = await Receta.find()
    .populate('pacienteId', 'nombre apellido cedula email telefono')
    .populate('doctorId', 'nombre apellidos email')
    .populate('sucursalId', 'nombre direccion telefono')
    .populate('citaId', 'fechaHora estado motivo notas sucursalId')
    .populate('medicamentos.medicamentoId', 'nombre')
    .lean();

    res.render('index', {
      usuario: req.session.usuario,
      recetas,
      viewParcial: 'admin/historialRecetas',
      request: req
    });
  } catch (error) {
    console.error('❌ Error al cargar el historial de recetas:', error);
    res.status(500).send('Error interno al cargar el historial de recetas');
  }
};
