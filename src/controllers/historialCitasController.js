const Historial = require('../models/historialCitas');
const BitacoraUso = require('../models/bitacoraUso');

exports.listar = async (req, res) => {
    try {
      const historialcitas = await Historial.find()
            .populate({
                path: "pacienteId",
                select: "email", 
            })
            .populate({
                path: "citaId",  
                populate: {
                    path: "doctorId",  
                    select: "nombre"   
                }
            });

      const bitacora = new BitacoraUso({
        usuarioId: req.session.usuario.id,
        tipoAccion: "Vio el historial de citas",
        fechaHora: new Date(),
      });
      await bitacora.save();

      res.render("index", {
        usuario: req.session.usuario,
        historialcitas,
        viewParcial: "admin/historialCitas",
      });
    } catch (error) {
      console.error("Error al listar el historial de citas:", error);
      res.status(500).send("Error al obtener el historial de citas");
    }
};