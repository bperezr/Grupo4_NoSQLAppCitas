const express = require('express');
const router  = express.Router();
const citasController  = require('../controllers/citasV2Controller');

router.post('/admin/crearCitas',citasController.crearCita);

module.exports = router;