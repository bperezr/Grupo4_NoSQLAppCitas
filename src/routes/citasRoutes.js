const express = require("express");
const router = express.Router();
const { generarHorarios, obtenerHorariosDisponibles } = require("../controllers/horariosController");
const { agendarCita, cancelarCita } = require("../controllers/citasController");
const Doctor = require("../models/doctores");
const Sucursal = require("../models/sucursales");

// Ruta para generar horarios automáticamente
router.post("/generar-horarios", async (req, res) => {
    try {
        await generarHorarios();
        res.status(200).json({ mensaje: "Horarios generados correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al generar horarios", error });
    }
});

// Ruta para obtener los horarios disponibles
router.get("/horarios", obtenerHorariosDisponibles);

// Ruta para agendar una cita
router.post("/agendar", agendarCita);

// Ruta para cancelar una cita
router.post("/admin/citas/cancelar/:citaId", cancelarCita);

router.get("/admin/citas", async (req, res) => {
  try {
    const doctores = await Doctor.find();
    const sucursales = await Sucursal.find(); 
    const usuario = req.session.usuario;

    res.render("index", {
      usuario,
      doctores,
      sucursales,
      viewParcial: "admin/citas",
    });
  } catch (error) {
    console.error("Error al cargar citas:", error);
    res.status(500).send("Error al cargar la vista de citas");
  }
});

module.exports = router;
