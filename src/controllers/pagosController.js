const Pago = require('../models/pagos');
const HistorialCita = require('../models/historialCitas');
const BitacoraUso = require('../models/bitacoraUso');

exports.listarPagos = async (req, res) => {
    try {
        const pagos = await Pago.find()
        .populate('pacienteId', 'email')
            .populate({
                path: "citaId",  
                populate: {
                    path: "doctorId",  
                    select: "nombre"   
                }
            });

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: "Vio el historial de pagos",
            fechaHora: new Date(),
        });
        await bitacora.save();

        res.render("index", {
            usuario: req.session.usuario,
            pagos,
            viewParcial: "admin/pagos"
        });
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        res.status(500).send("Error al obtener el historial de pagos");
    }
};

exports.cambiarEstadoPago = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const pagoActualizado = await Pago.findByIdAndUpdate(id, { estado }, { new: true });

        if (pagoActualizado?.citaId) {
            await HistorialCita.findOneAndUpdate(
                { citaId: pagoActualizado.citaId },
                { pago: estado === 'pagado' ? 'pagado' : 'pendiente' }
            );
        }

        const bitacora = new BitacoraUso({
            usuarioId: req.session.usuario.id,
            tipoAccion: "Cambió el estado del pago",
            fechaHora: new Date(),
        });
        await bitacora.save();

        res.redirect('/admin/pagos');
    } catch (error) {
        console.error("Error al cambiar estado del pago:", error);
        res.status(500).send("Error al cambiar estado del pago");
    }
};
