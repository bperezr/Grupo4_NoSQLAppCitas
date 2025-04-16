const express = require('express');
const router = express.Router();
const historialCitasController = require('../controllers/historialCitasController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/historialcitas', verificarRol('admin'), historialCitasController.listar);


module.exports = router;