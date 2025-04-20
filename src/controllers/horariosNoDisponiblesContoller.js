const mongoose = require('mongoose');
const HorarioNoDisponible = require('../models/horariosNoDisponibles');
const BitacoraUso = require('../models/bitacoraUso');
const { ObjectId } = mongoose.Types;

const mostrarVistaHorariosNoDisponibles = async (req, res) => {
  try {
    const doctorId = req.session.usuario.id;
    const objectIdDoctor = new ObjectId(doctorId);

    const fechaSeleccionada = req.query.fecha ? new Date(req.query.fecha) : new Date();
    const fechaSeleccionadaStr = fechaSeleccionada.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const horariosBloqueados = await HorarioNoDisponible.find({
      doctorId: objectIdDoctor,
      fecha: fechaSeleccionadaStr,
    });

    const horasBloqueadas = horariosBloqueados.map(h => h.horaInicio);

    const bitacora = new BitacoraUso({
      usuarioId: doctorId,
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
    const doctorId = req.session.usuario.id;
    const fecha = req.body.fecha;
    let horas = req.body['horas[]'];
    const detalle = req.body.detalle;

    if (!Array.isArray(horas)) {
      horas = [horas];
    }

    if (!fecha || !horas || horas.length === 0) {
      return res.status(400).json({ mensaje: "Debe seleccionar al menos una hora" });
    }

    const fechaStr = new Date(fecha).toISOString().split('T')[0]; // Convertir a YYYY-MM-DD
    const bloqueos = [];

    for (const hora of horas) {
      const nuevoBloqueo = new HorarioNoDisponible({
        doctorId,
        fecha: fechaStr,
        horaInicio: hora,
        horaFin: hora,
        detalle: detalle || null,
        fechaCreacion: new Date(),
      });

      await nuevoBloqueo.save();
      bloqueos.push(nuevoBloqueo);
    }

    const bitacora = new BitacoraUso({
      usuarioId: doctorId,
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
    const doctorId = req.session.usuario.id;
    const fecha = req.body.fecha;
    let horas = req.body['horas[]'];

    if (!Array.isArray(horas)) {
      horas = [horas];
    }

    if (!fecha || !horas || horas.length === 0) {
      return res.status(400).json({ mensaje: "Debe seleccionar al menos una hora" });
    }

    const fechaStr = new Date(fecha).toISOString().split('T')[0]; // Convertir a YYYY-MM-DD

    const horariosEliminados = await HorarioNoDisponible.deleteMany({
      doctorId,
      fecha: fechaStr,
      horaInicio: { $in: horas },
    });

    if (horariosEliminados.deletedCount === 0) {
      return res.status(404).json({ mensaje: "No se encontraron horarios bloqueados para eliminar" });
    }

    const bitacora = new BitacoraUso({
      usuarioId: doctorId,
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

  // Convertir a arreglo si horas es una cadena
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