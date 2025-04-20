const express = require('express');
const router = express.Router();
const farmaceuticosController = require('../controllers/farmaceuticosController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/farmaceuticos', verificarRol('admin'), farmaceuticosController.listar);
router.post('/admin/farmaceuticos', verificarRol('admin'), farmaceuticosController.crear);
router.post('/admin/farmaceuticos/editar/:id', verificarRol('admin'), farmaceuticosController.actualizar);
router.post('/admin/farmaceuticos/eliminar/:id', verificarRol('admin'), farmaceuticosController.eliminar);

module.exports = router;