const citasService = require('../services/citasService');
const BitacoraUso = require('../models/bitacoraUso');
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

       const bitacora = new BitacoraUso({
                  usuarioId: req.session.usuario.id,
                  tipoAccion: `Creación de cita para paciente ID: ${pacienteId}`,
                  fechaHora: new Date()
              });
              await bitacora.save();

      return res.redirect('/admin/listaCitas?creada=1');
    } catch (err) {
      console.error('Error al crear cita:', err);
      return res.redirect('/admin/crearCita?error=' + encodeURIComponent(err.message));
    }
  } 

  async getlistaCitasPendientesConfirmadas(req, res) {
        try {
          const item = await citasService.getlistaCitasPendientesConfirmadas();
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

  async getlistaCitasHistorial(req, res) {
    try {
      const item = await citasService.getlistaCitasHistorial();
      if (!item) {
        return res.status(404).json({ error: 'Citas no registradas' });
      } else {

        res.render("index", {
          usuario: req.session.usuario,
          item,
          viewParcial: "admin/historialCitas",
        }); 
      }    
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}


}

module.exports = new CitasController();