const mongoose = require('mongoose');
const HorarioNoDisponible = require('../models/horariosNoDisponibles');

class horarioNoDisponibleService {

  async obtenerPorFechaYDoctor(fecha, doctorId) {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      throw new Error('doctorId inválido');
    }
    return await HorarioNoDisponible.find({
      fecha,
      doctorId: new mongoose.Types.ObjectId(`${doctorId}`)
    });
  }

  async crear(data) {
    const nuevo = new HorarioNoDisponible(data);
    return await nuevo.save();
  }
}

module.exports = new horarioNoDisponibleService();