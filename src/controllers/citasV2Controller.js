const citasService = require('../services/citasService');
const mongoose = require('mongoose');

class CitasController{

    async crearCita(req, res) {
        try {
            const data = req.body;
            await citasService.crearCita(data); 

            res.redirect('/admin/crearCitas?agregado=1');
          } catch (err) {
            console.error('Error al crear cita:', err);
            return res.status(400).json({ error: err.message });
          }    
    }

}

module.exports = new CitasController();