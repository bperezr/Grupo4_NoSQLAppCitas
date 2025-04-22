const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/pagos', verificarRol('admin'), pagosController.listarPagos);
router.post('/admin/pagos/estado/:id', pagosController.cambiarEstadoPago);

module.exports = router;