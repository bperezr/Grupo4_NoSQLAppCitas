const express = require('express');
const router = express.Router();
const doctoresController = require('../controllers/doctoresController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/doctores', verificarRol('admin'), doctoresController.listar);
router.post('/admin/doctores', verificarRol('admin'), doctoresController.crear);
//router.post('/admin/doctores/editar/:id', verificarRol('admin'), doctoresController.actualizar);
router.post('/admin/doctores/eliminar/:id', verificarRol('admin'), doctoresController.eliminar);

module.exports = router;