const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctoresController'); 

// Ruta para obtener la lista de doctores
router.get('/doctores/citas', doctorController.getDoctoresCitas);

// Ruta para obtener la lista de doctores
router.get('/doctores', doctorController.getDoctores);

// Ruta para crear un doctor
router.post('/doctores/crear', doctorController.crearDoctor);

// Ruta para activar un doctor
router.get('/doctores/activar/:id', doctorController.activarDoctor);

// Ruta para desactivar un doctor
router.get('/doctores/desactivar/:id', doctorController.desactivarDoctor);

// Ruta para editar un doctor
router.get('/doctores/editar/:id', doctorController.editarDoctor);

// Ruta para actualizar un doctor
router.post('/doctores/editar/:id', doctorController.actualizarDoctor);


module.exports = router;
