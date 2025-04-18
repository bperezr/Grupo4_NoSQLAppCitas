const express = require('express');
const router = express.Router();
const sucursalesController = require('../controllers/adminitradoresController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/administradores', verificarRol('admin'), sucursalesController.listar);
router.post('/admin/administradores', verificarRol('admin'), sucursalesController.crear);
router.post('/admin/administradores/editar/:id', verificarRol('admin'), sucursalesController.actualizar);
router.post('/admin/administradores/eliminar/:id', verificarRol('admin'), sucursalesController.eliminar);

module.exports = router;