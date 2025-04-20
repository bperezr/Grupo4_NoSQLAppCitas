const express = require('express');
const router = express.Router();
const horarioNoDisponibleController = require('../controllers/horariosNoDisponiblesController');

// Obtener horarios no disponibles por fecha y doctor
router.get('/admin/horariosNoDisponible', horarioNoDisponibleController.obtenerPorFechaYDoctor);

// Crear nuevo horario bloqueado
router.post('/', horarioNoDisponibleController.crear);
const { bloquearHorario, mostrarVistaHorariosNoDisponibles, desbloquearHorario, gestionarHorarios } = require('../controllers/horariosNoDisponiblesContoller');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/doctor/horariosNoDisponibles', verificarRol('doctor'),  mostrarVistaHorariosNoDisponibles);
router.post('/doctor/gestionar-horarios', verificarRol('doctor'), gestionarHorarios);

module.exports = router;