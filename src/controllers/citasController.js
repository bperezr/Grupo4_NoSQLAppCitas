const mongoose = require("mongoose");
const Cita = require("../models/citas");
const Horario = require("../models/horariosDisponibles");
const Usuario = require("../models/usuarios");
const Doctor = require("../models/doctores");
const BitacoraUso = require('../models/bitacoraUso');
const { crearHistorialCita } = require('../services/historialService');
const HistorialCita = require('../models/historialCitas');
const Pago = require('../models/pagos');

const agendarCita = async (req, res) => {
  try {
    const pacienteId = req.session.usuario.id;
    const { doctorId, fechaHora, motivo } = req.body;

    console.log("Fecha enviada:", fechaHora);

    const pacienteIdObj = new mongoose.Types.ObjectId(pacienteId);
    const doctorIdObj = new mongoose.Types.ObjectId(doctorId);

    const paciente = await Usuario.findById(pacienteIdObj);
    if (!paciente) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    const doctor = await Doctor.findById(doctorIdObj);
    if (!doctor) {
      return res.status(404).json({ mensaje: "Doctor no encontrado" });
    }

    const especialidad = await mongoose
      .model("Especialidades")
      .findOne({ nombreEspecialidad: doctor.especialidad });
    if (!especialidad) {
      return res
        .status(404)
        .json({ mensaje: "Especialidad del doctor no encontrada" });
    }

    const fechaInicio = new Date(fechaHora);

    const horario = await Horario.findOne({
      doctorId: doctorIdObj,
      horaInicio: { $lte: fechaInicio },
      horaFin: { $gte: fechaInicio },
      disponible: true,
    });

    if (!horario) {
      return res.status(400).json({ mensaje: "Horario no disponible" });
    }

    const nuevaCita = new Cita({
      pacienteId: pacienteIdObj,
      doctorId: doctorIdObj,
      fechaHora: fechaInicio,
      estado: "pendiente",
      motivo,
    });

    const bitacora = new BitacoraUso({
      usuarioId: req.session.usuario.id,
      tipoAccion: `Creó una cita para el día y hora: ${nuevaCita.fechaHora}`,
      fechaHora: new Date(),
    });
    await bitacora.save();

    await nuevaCita.save();

    await crearHistorialCita({
      citaId: nuevaCita._id,
      pacienteId: pacienteIdObj,
      estado: nuevaCita.estado,
      pago: "pendiente",
    });

    const nuevoPago = new Pago({
      citaId: nuevaCita._id,
      pacienteId: pacienteIdObj,
      monto: especialidad.precioConsulta,
      fechaPago: new Date(),
      estado: "pendiente",
    });
    await nuevoPago.save();

    await Horario.updateOne({ _id: horario._id }, { disponible: false });

    res
      .status(201)
      .json({ mensaje: "Cita agendada correctamente", cita: nuevaCita });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al agendar cita", error });
  }
};

const cancelarCita = async (req, res) => {
  try {
    const { citaId } = req.params;

    const cita = await Cita.findById(citaId);
    if (!cita) {
      return res.status(404).json({ mensaje: "Cita no encontrada" });
    }

    cita.estado = "cancelada";
    await cita.save();

    await HistorialCita.findOneAndUpdate(
      { citaId: cita._id },
      { estado: "cancelada" },
      { new: true }
    );

    const tipoAccion = `Canceló la cita: ${cita._id}`;

    const bitacora = new BitacoraUso({
      usuarioId: req.session.usuario.id,
      tipoAccion: tipoAccion,
      fechaHora: new Date()
    });
    await bitacora.save();

    await Horario.updateOne(
      { doctorId: cita.doctorId, horaInicio: cita.fechaHora },
      { disponible: true }
    );
    res.redirect('/admin/historialcitas');
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cancelar cita", error });
  }
};

module.exports = { agendarCita, cancelarCita };