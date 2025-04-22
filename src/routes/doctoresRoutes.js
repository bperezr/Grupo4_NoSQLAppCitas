const express = require('express');
const router = express.Router();
const doctoresController = require('../controllers/doctoresController');
const { verificarRol } = require('../middleware/verificarRol');

// ------------------------------------------------ Rutas para rol admin

router.get('/admin/doctores', verificarRol('admin'), doctoresController.listar);
router.post('/admin/doctores', verificarRol('admin'), doctoresController.crear);
router.post('/admin/doctores/editar/:id', verificarRol('admin'), doctoresController.actualizar);
router.post('/admin/doctores/eliminar/:id', verificarRol('admin'), doctoresController.eliminar);
router.get('/admin/doctores/listar/:especialidad',  doctoresController.listarDoctoresPorEspecialidad);

// ------------------------------------------------ Rutas para rol el doctor

router.get('/doctor', verificarRol('doctor'), doctoresController.vistaDashboard);
router.get('/doctor/citas', verificarRol('doctor'), doctoresController.vistaCitasPendientes);
router.get('/doctor/historial', verificarRol('doctor'), doctoresController.vistaHistorialCitas);
router.get('/doctor/citas/:id/atender', verificarRol('doctor'), doctoresController.vistaAtenderCita);
router.post('/doctor/citas/:id/atender', verificarRol('doctor'), doctoresController.procesarAtencionCita);
router.delete('/doctor/citas/:id/eliminar', verificarRol('doctor'), doctoresController.eliminarReceta);

module.exports = router;