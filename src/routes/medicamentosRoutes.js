const express = require('express');
const router = express.Router();
const { Medicamento } = require('../controllers/medicamentosController'); 

// Crear medicamento
router.post('/medicamento', itemController.createItem);

module.exports = router;