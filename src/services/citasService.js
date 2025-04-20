const CitasModel = require('../models/citas'); 
const Especialidad = require('../models/especialidades');
const Sucursal     = require('../models/sucursales');
const Doctor   = require('../models/doctores');
const mongoose = require('mongoose');

class Citas{

    async cargarFormulario() {
      const especialidades = await Especialidad
        .find()
        .sort({ nombreEspecialidad: 1 });

      const sucursales = await Sucursal
        .find()
        .sort({ nombre: 1 });

      return { especialidades, sucursales };
    }

    async crearCita(data) {        
        ['pacienteId','doctorId','especialidadId','sucursalId'].forEach(f => {
          if (!mongoose.Types.ObjectId.isValid(data[f])) {
            throw new Error(`${f} inválido`);
          }
        });
        return await CitasModel.create(data);
    }

    async getlistaCitasPendientesConfirmadas() {
      return await CitasModel.aggregate([
        {
          $match: {
            $or: [
              { estado: "confirmada" },
              { estado: "pendiente" }
            ]
          }
        }, 
        {
          $lookup: {
            from:   "Especialidades",
            localField:  "especialidadId",
            foreignField:"_id",
            as:     "especialidad"
          }
        },
          { $unwind: "$especialidad" },     
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
            cedula: "$paciente.cedula",
            email: "$paciente.email",
            telefono: "$paciente.telefono",
            sucursal: "$sucursal.nombre",
            nombreEspecialidad: "$especialidad.nombreEspecialidad",
	          precioConsulta: "$especialidad.precioConsulta"
          }
        }
      ]);
    }  

    async getlistaCitasHistorial() {
      return await CitasModel.aggregate([
        {
          $match: {
            $nor: [
              { estado: "confirmada" },
              { estado: "pendiente" }
            ]
          }
        },      
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

    async editarCita(id, data) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID de cita inválido');
      }
      delete data._id;
      delete data.pacienteId;      

      return await CitasModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }  

    async getCitaPorId(id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('ID de cita inválido');
      }
      return await CitasModel.findById(id)
        .populate('pacienteId',   'nombre apellido cedula')          
        .populate('doctorId',     'nombre apellidos')                
        .populate('especialidadId','nombreEspecialidad precioConsulta') 
        .populate('sucursalId',   'nombre direccion');        
    }

    async listarDoctorPorEspecialidad(especialidadId) {
      if (!mongoose.Types.ObjectId.isValid(especialidadId)) {
        throw new Error('ID de especialidad inválido');
      }
      return await Doctor.find({ especialidadId });
    }

}

module.exports = new Citas();