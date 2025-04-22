const express = require('express');
const router = express.Router();
const citasController = require('../controllers/citasV2Controller');

router.get('/admin/crearCitas', citasController.cargarFormulario);
router.post('/admin/crearCitas', citasController.crearCita);
router.get('/admin/listaCitas', citasController.getlistaCitasPendientesConfirmadas);
router.get('/admin/citas/editar/:id', citasController.formEditarCita);
router.post('/admin/citas/editar/:id', citasController.editarCita);

module.exports = router;