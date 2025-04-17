const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios');

const run = async () => {
    await mongoose.connect('mongodb://localhost:27017/mediConnect');

    const usuariosExistentes = await Usuario.countDocuments();
    if (usuariosExistentes > 0) {
        console.log('Los usuarios ya existen en la base de datos.');
        return;
    }

    const salt = await bcrypt.genSalt(10);

    // Admin
    const hashedAdmin = await bcrypt.hash('admin01', salt);
    const admin = new Usuario({
        email: 'admin@mediconnect.com',
        contraseña: hashedAdmin,
        rol: 'admin',
        estado: 'activo',
        reinicioContraseña: false
    });

    // Doctor
    const hashedDoctor = await bcrypt.hash('doctor01', salt);
    const doctor = new Usuario({
        email: 'doctor@mediconnect.com',
        contraseña: hashedDoctor,
        rol: 'doctor',
        estado: 'activo',
        reinicioContraseña: false
    });

    // Paciente
    const hashedPaciente = await bcrypt.hash('paciente01', salt);
    const paciente = new Usuario({
        email: 'paciente@mediconnect.com',
        contraseña: hashedPaciente,
        rol: 'paciente',
        estado: 'activo',
        reinicioContraseña: false
    });

    await Usuario.insertMany([admin, doctor, paciente]);

    console.log('Usuarios creados con éxito');
};

module.exports = run;
