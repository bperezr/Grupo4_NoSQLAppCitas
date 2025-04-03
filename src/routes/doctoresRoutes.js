const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctoresController'); 

// Ruta para obtener la lista de doctores
router.get('/doctores', doctorController.getDoctores);

module.exports = router;
