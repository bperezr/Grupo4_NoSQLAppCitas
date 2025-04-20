const MedicamentoModel = require('../models/medicamentos');

class Medicamentos {

  async crearMedicamento(data) {
    const item = new MedicamentoModel(data);
    await item.save();
    return item;
  }

  async getMedicamento() {
    return await MedicamentoModel.find().populate({ path: 'sucursalId', model: 'Sucursales' });
  }

  async actualizarMedicamento(id, data) {
    return await MedicamentoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async eliminarMedicamento(id) {
    return await MedicamentoModel.findByIdAndDelete(id);
  }

}

module.exports = new Medicamentos();