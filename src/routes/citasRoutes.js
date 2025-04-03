const express = require("express");
const router = express.Router();
const { generarHorarios, obtenerHorariosDisponibles } = require("../controllers/horariosController");
const { agendarCita, cancelarCita } = require("../controllers/citasController");

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
router.put("/cancelar/:citaId", cancelarCita);

router.get('/admin/citas', (req, res) => {
    res.render('admin/citas'); 
});

module.exports = router;
