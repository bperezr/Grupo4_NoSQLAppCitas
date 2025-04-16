const express = require('express');
const router = express.Router();
const especialidadesController = require('../controllers/especialidadesController'); 

// Ruta para obtener la lista de especialidades
router.get('/especialidades', especialidadesController.getEspecialidades);

// Ruta para crear una especialidad
router.post('/especialidades/crear', especialidadesController.crearEspecialidad);

// Ruta para editar una especialidad
router.get('/especialidades/editar/:id', especialidadesController.editarEspecialidad);

// Ruta para actualizar una especialidad
router.post('/especialidades/editar/:id', especialidadesController.actualizarEspecialidad);

//Ruta para eliminar una especialidad
router.post('/especialidades/eliminar/:id', especialidadesController.eliminarEspecialidad);


module.exports = router;