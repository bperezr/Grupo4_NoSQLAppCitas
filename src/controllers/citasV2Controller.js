const citasService = require('../services/citasService');
const horarioNoDisponibleService = require('../services/horariosNoDisponiblesService');
const BitacoraUso = require('../models/bitacoraUso');
const Pago = require('../models/pagos');
const Doctor = require("../models/doctores"); 
const mongoose = require('mongoose');

class CitasController{

  async cargarFormulario(req, res) {
    try {
      const { especialidades, sucursales } = await citasService.cargarFormulario();
      
      res.render("index", {
        usuario: req.session.usuario,
        especialidades,
        sucursales,
        viewParcial: "admin/citas",
      }); 
      return res.render('crearCita', { especialidades, sucursales });
    } catch (err) {
      console.error('Error al cargar formulario de cita:', err);
      return res.status(500).send('Error interno al cargar el formulario');
    }
  }

  async crearCita(req, res) {
    try {
      const {
        pacienteId,
        doctorId,
        especialidadId,
        sucursalId,
        motivo,
        estado,
        selectedDate,
        selectedHour
      } = req.body;

      if (!selectedDate || !selectedHour) {
        return res.redirect('/admin/crearCita?error=Debe seleccionar fecha y hora');
      }

      const fechaHora = new Date(`${selectedDate}T${selectedHour}:00-06:00`);
      if (isNaN(fechaHora.getTime())) {
        return res.redirect('/admin/crearCita?error=Fecha u hora inválida');
      }

      const h = fechaHora.getHours();
      const m = fechaHora.getMinutes();
      if (m !== 0 || h < 8 || h > 18) {
        return res.redirect('/admin/crearCita?error=Hora fuera de horario (08–18)');
      }

      const convertirHoraADecimal = hora => {
        const [horas, minutos] = hora.split(':').map(Number);
        return horas + minutos / 60;
      };

      const bloqueos = await horarioNoDisponibleService.obtenerPorFechaYDoctor(selectedDate, doctorId);
      const horaSeleccionadaDecimal = convertirHoraADecimal(selectedHour);

      function sumarUnaHora(horaStr) {    
        const [h, m] = horaStr.split(':').map(n => parseInt(n, 10));
        const nuevaHora = (h + 1) % 24;  
        
        const hh = String(nuevaHora).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        return `${hh}:${mm}`;
      }   

      const detalleCita = "Ingreso cita admin";

      const bloquearHorario = {
        doctorId,
        fecha: selectedDate,
        horaInicio: selectedHour,
        horaFin: sumarUnaHora(selectedHour),
        detalle: detalleCita,
        fechaCreacion: new Date(),
      };

      await horarioNoDisponibleService.crear(bloquearHorario);

      const horaOcupada = bloqueos.some(b => {
        const inicio = convertirHoraADecimal(b.horaInicio);
        const fin = convertirHoraADecimal(b.horaFin);
        return horaSeleccionadaDecimal >= inicio && horaSeleccionadaDecimal < fin;
      });

      if (horaOcupada) {
        return res.redirect('/admin/crearCita?error=La hora seleccionada ya está ocupada');
      }

      const data = {
        pacienteId,
        doctorId,
        especialidadId,
        sucursalId,
        fechaHora,
        motivo,
        estado
      };
      const nuevaCita =  await citasService.crearCita(data);
      
       const bitacora = new BitacoraUso({
                  usuarioId: req.session.usuario.id,
                  tipoAccion: `Creación de cita para paciente ID: ${pacienteId}`,
                  fechaHora: new Date()
              });
              await bitacora.save();      

          const doctor = await Doctor.findById(doctorId); 
          console.log("datos doctor"+doctor );   

          const especialidad = await mongoose
            .model("Especialidades")
            .findById(especialidadId);

          if (!especialidad) {
            return res
              .status(404)
              .json({ mensaje: "Especialidad del doctor no encontrada" });
          }
      
 const pacienteIdObj = new mongoose.Types.ObjectId(pacienteId);
          const nuevoPago = new Pago({
            citaId: nuevaCita._id,
            pacienteId: pacienteIdObj,
            monto: especialidad.precioConsulta,
            fechaPago: new Date(),
            estado: "pendiente",
          });
          await nuevoPago.save(); 

      return res.redirect('/admin/listaCitas?creada=1');

    } catch (err) {
      console.error('Error al crear cita:', err);
      console.error('Reglas no cumplidas:', err.errInfo.details.schemaRulesNotSatisfied);
      return res.redirect('/admin/crearCita?error=' + encodeURIComponent(err.message));
    }
  } 

  async getlistaCitasPendientesConfirmadas(req, res) {
        try {
          const item = await citasService.getlistaCitasPendientesConfirmadas();
          if (!item) {
            return res.status(404).json({ error: 'Citas no registradas' });
          } else {
    
            res.render("index", {
              usuario: req.session.usuario,
              item,
              viewParcial: "admin/listaCitas",
            }); 
          }    
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
  }

  async getlistaCitasHistorial(req, res) {
    try {
      const item = await citasService.getlistaCitasHistorial();
      if (!item) {
        return res.status(404).json({ error: 'Citas no registradas' });
      } else {

        res.render("index", {
          usuario: req.session.usuario,
          item,
          viewParcial: "admin/historialCitas",
        }); 
      }    
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

async formEditarCita(req, res) {
  try {
    const { id } = req.params;

    const cita = await citasService.getCitaPorId(id);
    
    if (!cita) return res.status(404).send('Cita no encontrada');

    const { especialidades, sucursales } = await citasService.cargarFormulario();

    const doctores = await citasService.listarDoctorPorEspecialidad(cita.especialidadId._id); 
    return res.render('index', {
      usuario: req.session.usuario,
      cita,
      especialidades,
      sucursales,
      doctores,
      viewParcial: "admin/editarCita",
    });
  } catch (err) {
    console.error('Error al cargar edición de cita:', err);
    return res.status(500).send('Error interno al cargar formulario');
  }
}


async editarCita(req, res) {
  try {
    const { id } = req.params;
    const data   = req.body;
    await citasService.editarCita(id, data);

    return res.redirect('/admin/listaCitas?editada=1');
  } catch (err) {
    console.error('Error al editar cita:', err);
    return res.status(400).send('No se pudo actualizar la cita: ' + err.message);
  }
}



}

module.exports = new CitasController();