const express = require('express');
const router = express.Router();
const RecetaController  = require('../controllers/recetasController');

router.get('/admin/recetas', RecetaController.getRecetas);
router.post('/recetas/crear', RecetaController.crearReceta);
router.post('/recetas/actualizar/:id', RecetaController.actualizarReceta);
router.post('/recetas/eliminar/:id', RecetaController.eliminarReceta);

module.exports = router;
