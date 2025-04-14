const mongoose = require("mongoose");
const Cita = require("../models/citas");
const Horario = require("../models/horariosDisponibles");
const Usuario = require("../models/usuarios"); 
const Doctor = require("../models/doctores"); 
const BitacoraUso = require('../models/bitacoraUso');

// Agendar cita
const agendarCita = async (req, res) => {
  try {
    const pacienteId = req.session.usuario.id;
    const { doctorId, fechaHora, motivo } = req.body;

    console.log("Fecha enviada:", fechaHora); 

    // Convertir los IDs a ObjectId
    const pacienteIdObj = new mongoose.Types.ObjectId(pacienteId);
    const doctorIdObj = new mongoose.Types.ObjectId(doctorId);

    // Validar que el paciente exista
    const paciente = await Usuario.findById(pacienteIdObj);
    if (!paciente) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    // Validar que el doctor exista
    const doctor = await Doctor.findById(doctorIdObj);
    if (!doctor) {
      return res.status(404).json({ mensaje: "Doctor no encontrado" });
    }

    // Convertir la fechaHora a UTC para hacer comparaciones consistentes
    const fechaInicio = new Date(fechaHora);  // La fecha debe venir como un string ISO o Date en UTC

    // Consultar si existe un horario disponible dentro del rango de la fecha
    const horario = await Horario.findOne({
      doctorId: doctorIdObj,
      horaInicio: { $lte: fechaInicio }, 
      horaFin: { $gte: fechaInicio },   
      disponible: true,
    });

    if (!horario) {
      return res.status(400).json({ mensaje: "Horario no disponible" });
    }

    // Crear la cita 
    const nuevaCita = new Cita({
      pacienteId: pacienteIdObj,
      doctorId: doctorIdObj,
      fechaHora: fechaInicio,  // La cita también se guarda en UTC
      estado: "pendiente",
      motivo,
    });

    const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: `Creó una cita para el día y hora: ${nuevaCita.fechaHora}`,
            fechaHora: new Date()
        });
        await bitacora.save();

    // Guardar la cita
    await nuevaCita.save();

    // Marcar el horario como no disponible
    await Horario.updateOne({ _id: horario._id }, { disponible: false });

    res.status(201).json({ mensaje: "Cita agendada correctamente", cita: nuevaCita });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al agendar cita", error });
  }
};

// Cancelar cita
const cancelarCita = async (req, res) => {
  try {
    const { citaId } = req.params;

    // Buscar la cita por ID
    const cita = await Cita.findById(citaId);
    if (!cita) {
      return res.status(404).json({ mensaje: "Cita no encontrada" });
    }

    // Cambiar el estado de la cita a cancelada
    cita.estado = "cancelada";
    await cita.save();

    // Hacer el horario disponible nuevamente
    await Horario.updateOne(
      { doctorId: cita.doctorId, fecha: cita.fechaHora }, 
      { disponible: true }
    );

    res.status(200).json({ mensaje: "Cita cancelada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cancelar cita", error });
  }
};

module.exports = { agendarCita, cancelarCita };
