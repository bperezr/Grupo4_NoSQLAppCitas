const express = require('express');
const router = express.Router();
const recetasController = require('../controllers/recetasController');
const { verificarRol } = require('../middleware/verificarRol');

router.post('/recetas/crear-json', verificarRol('doctor'), recetasController.crear);
router.get('/admin/historialRecetas', verificarRol('admin'), recetasController.historialRecetas);

module.exports = router;