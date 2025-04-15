const recetasService  = require('../services/recetasService');

class RecetaController{

    async crearReceta(req, res) {
        try {
          const receta = await recetasService.crearReceta(req.body);
          res.redirect('/admin/recetas'); 
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    
      async getRecetas(req, res) {
        try {
          const recetas = await recetasService.getRecetas();
          res.render('index', {
            usuario: req.session.usuario,
            recetas,
            viewParcial: 'admin/recetas'
          });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    
      async editarReceta(req, res) {
        try {
          const receta = await recetasService.obtenerRecetaPorId(req.params.id);
          if (!receta) {
            return res.status(404).json({ error: 'Receta no encontrada' });
          }
          res.render('index', {
            usuario: req.session.usuario,
            receta,
            viewParcial: 'admin/recetas'
          });
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    
      async actualizarReceta(req, res) {
        try {
          await recetasService.actualizarReceta(req.params.id, req.body);
          res.redirect('/admin/recetas');
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    
      async eliminarReceta(req, res) {
        try {
          await recetasService.eliminarReceta(req.params.id);
          res.redirect('/admin/recetas');
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    }    

module.exports = new RecetaController();