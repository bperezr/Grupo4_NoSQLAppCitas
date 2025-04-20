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

    async getlistaCitas() {
      return await CitasModel.aggregate([
        {
          $lookup: {
            from:        "Doctores",
            localField:  "doctorId",
            foreignField:"_id",
            as:          "doctor"
          }
        },
        { $unwind: "$doctor" },
        {
          $lookup: {
            from:        "Pacientes",
            localField:  "pacienteId",
            foreignField:"_id",
            as:          "paciente"
          }
        },
        { $unwind: "$paciente" },
        {
          $lookup: {
            from:        "Sucursales",
            localField:  "sucursalId",
            foreignField:"_id",
            as:          "sucursal"
          }
        },
        { $unwind: "$sucursal" },
        {
          $project: {
            _id:       1,
            fechaHora: 1,
            estado:    1,
            motivo:    1,
            notas:     1,
            doctor: {
              $concat: [
                "$doctor.nombre", " ",
                { $ifNull: [ "$doctor.apellidos", "" ] }
              ]
            },
            paciente: {
              $concat: [
                "$paciente.nombre", " ",
                { $ifNull: [ "$paciente.apellido", "" ] }
              ]
            },
            sucursal: "$sucursal.nombre"
          }
        }
      ]);
    }
  
}

module.exports = new Citas();