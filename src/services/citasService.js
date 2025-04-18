const CitasModel = require('../models/citas'); 
const mongoose = require('mongoose');

class Citas{

async crearCita(data) {        
        ['pacienteId','doctorId','especialidadId','sucursalId'].forEach(f => {
          if (!mongoose.Types.ObjectId.isValid(data[f])) {
            throw new Error(`${f} inválido`);
          }
        });
        return await CitasModel.create(data);
    }
}

module.exports = new Citas();