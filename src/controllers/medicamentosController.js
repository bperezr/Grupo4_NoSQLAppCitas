const medicamentosService  = require('../services/medicamentosService');

class MedicamentoController{

   async crearMedicamento(req, res) {
    try {
      const item = await medicamentosService.crearMedicamento(req.body);
      res.redirect('/admin/medicamentos'); 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getMedicamento(req, res) {
    try {
      const item = await medicamentosService.getMedicamento();
      if (!item) {
        return res.status(404).json({ error: 'Medicamento no encontrado' });
      } else {

        res.render("index", {
          usuario: req.session.usuario,
          item,
          viewParcial: "admin/medicamentos",
        }); 
      }    
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async actualizarMedicamento(req, res) {
    try {
      await medicamentosService.actualizarMedicamento(req.params.id, req.body);
      res.redirect('/admin/medicamentos');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async eliminarMedicamento(req, res) {
    try {
      await medicamentosService.eliminarMedicamento(req.params.id);
      res.redirect('/admin/medicamentos');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

}
module.exports = new MedicamentoController();

