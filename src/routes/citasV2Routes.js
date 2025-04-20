const express = require('express');
const router  = express.Router();
const citasController  = require('../controllers/citasV2Controller');

router.post('/admin/crearCitas',citasController.crearCita);
router.get('/admin/listaCitas', citasController.getlistaCitas);
router.get('/admin/citas/editar/:id', citaController.formEditarCita);
router.post('/admin/citas/editar/:id', citaController.editarCita);


module.exports = router;