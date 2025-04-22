const RecetaModel = require('../models/recetas');

class Recetas {

  async crearReceta(data) {
    const item = new RecetaModel(data);
    await item.save();
    return item;
  }

  async getRecetas() {
    return await RecetaModel.find();
  }

  async obtenerRecetaPorId(id) {
    return await RecetaModel.findById(id);
  }

  async actualizarReceta(id, data) {
    return await RecetaModel.findByIdAndUpdate(id, data, { new: true });
  }

  async eliminarReceta(id) {
    return await RecetaModel.findByIdAndDelete(id);
  }

}

module.exports = new Recetas();