const mongoose = require('mongoose');
const HorarioNoDisponible = require('../models/horariosNoDisponibles');
const BitacoraUso = require('../models/bitacoraUso');
const Doctor = require('../models/doctores');
const { ObjectId } = mongoose.Types;

const obtenerDoctorIdPorUsuarioId = async (usuarioId) => {
  const doctor = await Doctor.findOne({ usuarioId: new ObjectId(usuarioId) });
  if (!doctor) throw new Error('Doctor no encontrado para el usuario logueado');
  return doctor._id;
};

const mostrarVistaHorariosNoDisponibles = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const doctorId = await obtenerDoctorIdPorUsuarioId(usuarioId);

    const fechaSeleccionada = req.query.fecha ? new Date(req.query.fecha) : new Date();
    const fechaSeleccionadaStr = fechaSeleccionada.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const horariosBloqueados = await HorarioNoDisponible.find({
      doctorId,
      fecha: fechaSeleccionadaStr,
    });

    const horasBloqueadas = horariosBloqueados.map(h => h.horaInicio);

    const bitacora = new BitacoraUso({
      usuarioId,
      tipoAccion: `Ingresó a ver los horarios de consulta disponibles`,
      fechaHora: new Date(),
    });
    await bitacora.save();

    res.render("index", {
      usuario: req.session.usuario,
      viewParcial: "doctor/horariosNoDisponibles",
      horarios: horariosBloqueados,
      horasBloqueadas: horasBloqueadas,
      request: req,
    });
  } catch (error) {
    console.error("Error al mostrar horarios no disponibles:", error);
    res.status(500).send("Error al mostrar horarios no disponibles.");
  }
};

const bloquearHorario = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const doctorId = await obtenerDoctorIdPorUsuarioId(usuarioId);

    const fecha = req.body.fecha;
    let horas = req.body['horas[]'];
    const detalle = req.body.detalle;

    if (!Array.isArray(horas)) {
      horas = [horas];
    }

    if (!fecha || !horas || horas.length === 0) {
      return res.status(400).json({ mensaje: "Debe seleccionar al menos una hora" });
    }

    const fechaStr = new Date(fecha).toISOString().split('T')[0];
    const bloqueos = [];

    const sumarUnaHora = (horaStr) => {
      const [hora, minuto] = horaStr.split(':').map(Number);
      const nuevaHora = (hora + 1).toString().padStart(2, '0');
      return `${nuevaHora}:${minuto.toString().padStart(2, '0')}`;
    };

    for (const hora of horas) {
      const nuevoBloqueo = new HorarioNoDisponible({
        doctorId,
        fecha: fechaStr,
        horaInicio: hora,
        horaFin: sumarUnaHora(hora),
        detalle: detalle || null,
        fechaCreacion: new Date(),
      });

      await nuevoBloqueo.save();
      bloqueos.push(nuevoBloqueo);
    }

    const bitacora = new BitacoraUso({
      usuarioId,
      tipoAccion: `Bloqueó ${horas.length} horario(s) el día ${fechaStr}`,
      fechaHora: new Date(),
    });
    await bitacora.save();

    return res.status(201).json({
      mensaje: "Horario bloqueado correctamente",
      horarios: bloqueos,
    });

  } catch (error) {
    console.error("Error al bloquear horario:", error);
    res.status(500).json({ mensaje: "Error al bloquear horario", error });
  }
};

const desbloquearHorario = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const doctorId = await obtenerDoctorIdPorUsuarioId(usuarioId);

    const fecha = req.body.fecha;
    let horas = req.body['horas[]'];

    if (!Array.isArray(horas)) {
      horas = [horas];
    }

    if (!fecha || !horas || horas.length === 0) {
      return res.status(400).json({ mensaje: "Debe seleccionar al menos una hora" });
    }

    const fechaStr = new Date(fecha).toISOString().split('T')[0];

    const horariosEliminados = await HorarioNoDisponible.deleteMany({
      doctorId,
      fecha: fechaStr,
      horaInicio: { $in: horas },
    });

    if (horariosEliminados.deletedCount === 0) {
      return res.status(404).json({ mensaje: "No se encontraron horarios bloqueados para eliminar" });
    }

    const bitacora = new BitacoraUso({
      usuarioId,
      tipoAccion: `Desbloqueó ${horas.length} horario(s) el día ${fechaStr}`,
      fechaHora: new Date(),
    });
    await bitacora.save();

    return res.status(200).json({
      mensaje: "Horario(s) desbloqueado(s) correctamente",
    });

  } catch (error) {
    console.error("Error al desbloquear horario:", error);
    res.status(500).json({ mensaje: "Error al desbloquear horario", error });
  }
};

const gestionarHorarios = (req, res) => {
  const { accion } = req.body;
  let horas = req.body["horas[]"];

  if (!Array.isArray(horas)) {
    horas = [horas];
  }

  if (!horas || horas.length === 0) {
    return res.status(400).send("Debe seleccionar al menos una hora");
  }

  if (accion === "bloquear") {
    return bloquearHorario(req, res);
  } else if (accion === "desbloquear") {
    return desbloquearHorario(req, res);
  } else {
    return res.status(400).send("Acción no válida");
  }
};

module.exports = { bloquearHorario, mostrarVistaHorariosNoDisponibles, desbloquearHorario, gestionarHorarios };