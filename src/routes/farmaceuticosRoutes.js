const express = require('express');
const router = express.Router();
const farmaceuticosController = require('../controllers/farmaceuticosController');
const { verificarRol } = require('../middleware/verificarRol');

router.get('/admin/farmaceuticos', verificarRol('admin'), farmaceuticosController.listar);
router.post('/admin/farmaceuticos', verificarRol('admin'), farmaceuticosController.crear);
router.post('/admin/farmaceuticos/editar/:id', verificarRol('admin'), farmaceuticosController.actualizar);
router.post('/admin/farmaceuticos/eliminar/:id', verificarRol('admin'), farmaceuticosController.eliminar);

// ------------------------------------------------ Rutas para rol el farmaceutico

router.get('/farmaceutico/recetas', verificarRol('farmaceutico'), farmaceuticosController.listarRecetasSucursal);
router.get('/farmaceutico/recetas_historial', verificarRol('farmaceutico'), farmaceuticosController.listarRecetasSucursalHistorial);
router.post('/farmaceutico/atender/:id', verificarRol('farmaceutico'), farmaceuticosController.atenderReceta);

module.exports = router;