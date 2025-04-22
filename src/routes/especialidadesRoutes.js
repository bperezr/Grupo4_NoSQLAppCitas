const express = require('express');
const router = express.Router();
const especialidadesController = require('../controllers/especialidadesController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/especialidades', verificarRol('admin'), especialidadesController.getEspecialidades);
router.get('/admin/especialidades/listar', verificarRol('admin'), especialidadesController.listarEspecialidades);
router.post('/admin/especialidades', verificarRol('admin'), especialidadesController.crearEspecialidad);
router.post('/admin/especialidades/editar/:id', verificarRol('admin'), especialidadesController.actualizarEspecialidad);
router.post('/admin/especialidades/eliminar/:id', verificarRol('admin'), especialidadesController.eliminarEspecialidad);

module.exports = router;