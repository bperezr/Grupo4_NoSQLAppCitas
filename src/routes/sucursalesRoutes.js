const express = require('express');
const router = express.Router();
const sucursalesController = require('../controllers/sucursalesController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/sucursales', verificarRol('admin'), sucursalesController.listar);
router.post('/admin/sucursales', verificarRol('admin'), sucursalesController.crear);
router.get('/admin/sucursales/editar/:id', verificarRol('admin'), sucursalesController.verSucursal);
router.post('/admin/sucursales/editar/:id', verificarRol('admin'), sucursalesController.actualizar);
router.post('/admin/sucursales/eliminar/:id', verificarRol('admin'), sucursalesController.eliminar);

module.exports = router;