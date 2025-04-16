const HistorialCita = require('../models/historialCitas');

const crearHistorialCita = async ({ citaId, pacienteId, estado = 'pendiente', pago = 'pendiente' }) => {
  try {
    const nuevoHistorial = new HistorialCita({
      citaId,
      pacienteId,
      estado,
      pago
    });
    await nuevoHistorial.save();
  } catch (error) {
    console.error('Error al crear historial de cita:', error);
  }
};

module.exports = {
  crearHistorialCita
};
