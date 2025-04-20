const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const medicamentosService = require('../services/medicamentosService');
const BitacoraUso = require('../models/bitacoraUso');
const Sucursal = mongoose.model('Sucursales');
const Medicamento = require('../models/medicamentos');


// Listar medicamentos
exports.listar = async (req, res) => {
  try {
    const medicamentos = await medicamentosService.getMedicamento();
    const sucursales = await Sucursal.find();

    await new BitacoraUso({
      usuarioId: req.session.usuario.id,
      tipoAccion: 'Vio los Medicamentos',
      fechaHora: new Date()
    }).save();

    res.render('index', {
      usuario: req.session.usuario,
      medicamentos,
      sucursales,
      viewParcial: 'admin/medicamentos'
    });
  } catch (error) {
    console.error('Error al listar medicamentos:', error);
    res.status(500).send('Error al obtener los medicamentos');
  }
};

// Crear medicamento
exports.crear = async (req, res) => {
  try {
    const data = {
      ...req.body,
      sucursalId: new ObjectId(req.body.sucursalId),
      fechaIngreso: new Date(),
      activo: req.body.activo === 'true' || req.body.activo === true
    };

    const item = await medicamentosService.crearMedicamento(data);

    await new BitacoraUso({
      usuarioId: req.session.usuario.id,
      tipoAccion: `Creó el medicamento: ${item.nombre} (${item.marca})`,
      fechaHora: new Date()
    }).save();

    res.redirect('/admin/medicamentos?agregado=1');
  } catch (error) {
    console.error('Error al crear medicamento:', error);
    res.status(500).send('Error al crear el medicamento');
  }
};

// Actualizar medicamento
exports.actualizar = async (req, res) => {
  try {
    const data = {
      ...req.body,
      sucursalId: new ObjectId(req.body.sucursalId),
      fechaIngreso: req.body.fechaIngreso ? new Date(req.body.fechaIngreso) : new Date(),
      activo: req.body.activo === 'true' || req.body.activo === true
    };

    const item = await medicamentosService.actualizarMedicamento(req.params.id, data);

    await new BitacoraUso({
      usuarioId: req.session.usuario.id,
      tipoAccion: `Actualizó el medicamento: ${item.nombre} (${item.marca})`,
      fechaHora: new Date()
    }).save();

    res.redirect('/admin/medicamentos?editado=1');
  } catch (error) {
    console.error('Error al actualizar medicamento:', error);
    res.status(500).send('Error al actualizar el medicamento');
  }
};

// Eliminar medicamento
exports.eliminar = async (req, res) => {
  try {
    const item = await medicamentosService.eliminarMedicamento(req.params.id);

    if (!item) {
      return res.status(404).send('Medicamento no encontrado');
    }

    await new BitacoraUso({
      usuarioId: req.session.usuario.id,
      tipoAccion: `Eliminó el medicamento: ${item.nombre} (${item.marca})`,
      fechaHora: new Date()
    }).save();

    res.redirect('/admin/medicamentos?eliminado=1');
  } catch (error) {
    console.error('Error al eliminar medicamento:', error);
    res.status(500).send('Error al eliminar el medicamento');
  }
};

exports.obtenerPorSucursal = async (req, res) => {
  try {
    const { sucursalId } = req.query;

    if (!sucursalId) {
      return res.status(400).json({ error: 'El parámetro sucursalId es obligatorio.' });
    }

    const medicamentos = await Medicamento.find({
      sucursalId,
      activo: true
    });

    res.json(medicamentos);
  } catch (error) {
    console.error('Error al obtener medicamentos por sucursal:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};