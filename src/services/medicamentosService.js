const itemMedicamento = require('../models/medicamentos')

class Medicamentos{

    async crearMedicamento(data) {
        const item = new itemMedicamento(data);
        await item.save();
        return item;
      }
}

module.exports = new Medicamentos();