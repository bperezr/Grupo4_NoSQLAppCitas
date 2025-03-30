const express = require('express');
const router = express.Router();
const bitacoraController = require('../controllers/bitacoraController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/bitacora', verificarRol('admin'), bitacoraController.listar);
router.delete('/admin/bitacora/eliminar-todos', verificarRol('admin'), bitacoraController.eliminarTodos);

module.exports = router;