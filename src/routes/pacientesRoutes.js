const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacientesController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/pacientes', verificarRol('admin'), pacientesController.listar);
router.post('/admin/pacientes', verificarRol('admin'), pacientesController.crear);
router.get('/admin/pacientes/consultar/:cedula', pacientesController.consultarCedula);
router.post('/admin/pacientes/editar/:id', verificarRol('admin'), pacientesController.actualizar);
router.post('/admin/pacientes/eliminar/:id', verificarRol('admin'), pacientesController.eliminar);

module.exports = router;