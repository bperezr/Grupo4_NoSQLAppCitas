const express = require('express');
const router = express.Router();
const medicamentosController = require('../controllers/medicamentosController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/medicamentos', verificarRol('admin'), medicamentosController.listar);
router.post('/medicamento/crear', verificarRol('admin'), medicamentosController.crear);
router.post('/medicamento/actualizar/:id', verificarRol('admin'), medicamentosController.actualizar);
router.post('/medicamento/eliminar/:id', verificarRol('admin'), medicamentosController.eliminar);

// ruta API para obtener medicamentos por sucursal
router.get('/api/medicamentos', verificarRol(['admin', 'doctor', 'farmaceutico']), medicamentosController.obtenerPorSucursal);

module.exports = router;