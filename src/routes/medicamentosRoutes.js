const express = require('express');
const router = express.Router();
const Medicamento  = require('../controllers/medicamentosController');

router.get('/admin/medicamentos', Medicamento.getMedicamento);

// Crear medicamento
router.post('/medicamento/crear', Medicamento.crearMedicamento);
router.post('/medicamento/actualizar/:id', Medicamento.actualizarMedicamento);
router.post('/medicamento/eliminar/:id', Medicamento.eliminarMedicamento);

module.exports = router;
