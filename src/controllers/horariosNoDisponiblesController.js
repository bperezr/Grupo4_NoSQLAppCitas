const horarioNoDisponibleService = require('../services/horariosNoDisponiblesService');

class horarioNoDisponibleController  {

  async obtenerPorFechaYDoctor(req, res) {
    try {
      const { fecha, doctorId } = req.query;
      console.log("Backend recibió:", fecha, doctorId);
      const horarios = await horarioNoDisponibleService.obtenerPorFechaYDoctor(fecha,doctorId);
      res.json(horarios);
    } catch (error) {
      console.error('Error al obtener horarios no disponibles:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async crear(req, res) {
    try {
      const nuevoHorario = await horarioNoDisponibleService.crear(req.body);
      res.status(201).json(nuevoHorario);
    } catch (error) {
      console.error('Error al crear horario no disponible:', error);
      res.status(500).json({ error: 'Error al guardar el horario no disponible' });
    }
  }
}

module.exports = new horarioNoDisponibleController();
