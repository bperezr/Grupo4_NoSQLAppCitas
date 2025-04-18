const citasService = require('../services/citasService');
const mongoose = require('mongoose');

class CitasController{

    async crearCita(req, res) {
        try {
            const data = req.body;
            console.log("entrando a crear cita" && req.body);
            const cita = await citasService.crearCita(data);            
            return res.status(201).json(cita);
          } catch (err) {
            console.error('Error al crear cita:', err);
            return res.status(400).json({ error: err.message });
          }    
    }

}

module.exports = new CitasController();