const Doctor = require('../models/doctores');

// Obtener todos los doctores
exports.getDoctores = async (req, res) => {
    try {
        const doctores = await Doctor.find({ estado: 'activo' }); 
        res.status(200).json(doctores);
    } catch (error) {
        console.error('Error al obtener doctores:', error);
        res.status(500).json({ message: 'Error al obtener doctores' });
    }
};