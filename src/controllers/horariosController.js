const mongoose = require("mongoose");
const Horario = require("../models/horariosDisponibles"); 
const Doctor = require("../models/doctores");

//Obtener los horarios disponibles
const obtenerHorariosDisponibles = async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0); // Establecer a medianoche en UTC
        const todayEnd = new Date();
        todayEnd.setUTCHours(23, 59, 59, 999);

        const horarios = await Horario.find({
            disponible: true,
            fecha: { $gte: todayStart, $lte: todayEnd }
        }).populate('doctorId');
        
        if (!horarios || horarios.length === 0) {
            console.error("No se encontraron horarios.");
            return res.status(404).json({ mensaje: "No hay horarios disponibles" });
        }

        res.status(200).json(horarios); 
    } catch (error) {
        console.error("Error al obtener horarios:", error);
        res.status(500).json({ mensaje: "Error al obtener horarios", error });
    }
};

//Generar Horarios
const generarHorarios = async () => {
    try {
        const doctores = await Doctor.find({ estado: "activo" });

        const fechaHoy = new Date();
        fechaHoy.setUTCHours(0, 0, 0, 0); // Establecer la fecha a medianoche en UTC

        for (const doctor of doctores) {
            // Verificar si ya hay horarios para este doctor en la fecha actual
            const existeHorario = await Horario.exists({
                doctorId: doctor._id,
                fecha: fechaHoy
            });

            if (existeHorario) {
                console.log(`Horarios ya existen para el doctor ${doctor._id}, se omite generación.`);
                continue; // Pasar al siguiente doctor sin generar nuevos horarios
            }

            // Si no existen, generarlos
            const fechaInicio = new Date(fechaHoy);  
            fechaInicio.setUTCHours(8, 0, 0, 0); 

            const fechaFin = new Date(fechaHoy); 
            fechaFin.setUTCHours(17, 0, 0, 0); 

            const horarios = [];
            let hora = new Date(fechaInicio);

            while (hora < fechaFin) {
                const horaFin = new Date(hora);
                horaFin.setUTCMinutes(horaFin.getUTCMinutes() + 30); // Incremento de 30 minutos en UTC

                // Guardar los horarios en formato ISO 
                horarios.push({
                    doctorId: doctor._id,
                    fecha: fechaHoy, 
                    horaInicio: hora.toISOString(),  
                    horaFin: horaFin.toISOString(),
                    disponible: true,
                    sucursalId: doctor.sucursalId,
                    fechaHora: hora.toISOString() 
                });

                hora = new Date(horaFin); // Mover a la siguiente franja horaria
            }

            await Horario.insertMany(horarios); // Insertar los horarios generados
            console.log(`Horarios generados para el doctor ${doctor._id}`);
        }

        console.log("Proceso de generación de horarios finalizado");
    } catch (error) {
        console.error("Error al generar horarios", error);
    }
};


module.exports = { generarHorarios, obtenerHorariosDisponibles };