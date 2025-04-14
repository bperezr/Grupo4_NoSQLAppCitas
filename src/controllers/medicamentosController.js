const itemMedicamento  = require('../services/medicamentosService');

class MedicamentoController{

   async crearMedicamento(req, res) {
    try {
      const item = await itemMedicamento.createItem(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
module.exports = new MedicamentoController();

