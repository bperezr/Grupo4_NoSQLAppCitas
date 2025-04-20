const citasService = require('../services/citasService');
const mongoose = require('mongoose');

class CitasController{

  async crearCita(req, res) {
    try {
      const {
        pacienteId,
        doctorId,
        especialidadId,
        sucursalId,
        motivo,
        estado, 
        selectedDate,
        selectedHour
      } = req.body;

      if (!selectedDate || !selectedHour) {
        return res.redirect('/admin/crearCita?error=Debe seleccionar fecha y hora');
      }

      const fechaHora = new Date(`${selectedDate}T${selectedHour}:00-06:00`);
      if (isNaN(fechaHora.getTime())) {
        return res.redirect('/admin/crearCita?error=Fecha u hora inválida');
      }
      const h = fechaHora.getHours();
      const m = fechaHora.getMinutes();
      if (m !== 0 || h < 8 || h > 18) {
        return res.redirect('/admin/crearCita?error=Hora fuera de horario (08–18)');
      }
      const data = {
        pacienteId,
        doctorId,
        especialidadId,
        sucursalId,
        fechaHora,
        motivo,
        estado
      };

      await citasService.crearCita(data);
      return res.redirect('/admin/listaCitas?creada=1');
    } catch (err) {
      console.error('Error al crear cita:', err);
      return res.redirect('/admin/crearCita?error=' + encodeURIComponent(err.message));
    }
  }


  async getlistaCitas(req, res) {
        try {
          const item = await citasService.getlistaCitas();
          if (!item) {
            return res.status(404).json({ error: 'Citas no registradas' });
          } else {
    
            res.render("index", {
              usuario: req.session.usuario,
              item,
              viewParcial: "admin/listaCitas",
            }); 
          }    
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
  }

  

}

module.exports = new CitasController();