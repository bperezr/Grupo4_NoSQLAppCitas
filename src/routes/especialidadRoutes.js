const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidadController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/especialidades', verificarRol('admin'), especialidadController.listar);
router.post('/admin/especialidades', verificarRol('admin'), especialidadController.crear);
router.post('/admin/especialidades/editar/:id', verificarRol('admin'), especialidadController.actualizar);
router.post('/admin/especialidades/eliminar/:id', verificarRol('admin'), especialidadController.eliminar);

module.exports = router;