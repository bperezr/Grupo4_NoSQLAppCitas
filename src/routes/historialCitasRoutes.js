const express = require('express');
const router = express.Router();
const citasController = require('../controllers/historialCitasController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/historialCitas', verificarRol('admin'), citasController.vistaHistorialTodasCitas);

module.exports = router;