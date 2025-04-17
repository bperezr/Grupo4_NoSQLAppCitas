const express = require('express');
const router = express.Router();
const horarioNoDisponibleController = require('../controllers/horariosNoDisponiblesController');

// Obtener horarios no disponibles por fecha y doctor
router.get('/admin/horariosNoDisponible', horarioNoDisponibleController.obtenerPorFechaYDoctor);

// Crear nuevo horario bloqueado
router.post('/', horarioNoDisponibleController.crear);

module.exports = router;