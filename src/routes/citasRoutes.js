const express = require("express");
const router = express.Router();
const { generarHorarios, obtenerHorariosDisponibles } = require("../controllers/horariosController");
const { agendarCita, cancelarCita } = require("../controllers/citasController");

router.post("/generar-horarios", async (req, res) => {
  try {
    await generarHorarios();
    res.status(200).json({ mensaje: "Horarios generados correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al generar horarios", error });
  }
});

router.get("/horarios", obtenerHorariosDisponibles);
router.post("/agendar", agendarCita);
router.post("/admin/citas/cancelar/:citaId", cancelarCita);

module.exports = router;