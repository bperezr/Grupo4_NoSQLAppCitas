const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios');

const run = async () => {
    await mongoose.connect('mongodb://localhost:27017/mediConnect');

    const salt = await bcrypt.genSalt(10);

    // Admin
    const hashedAdmin = await bcrypt.hash('admin01', salt);
    const admin = new Usuario({
        email: 'admin@mediconnect.com',
        contraseña: hashedAdmin,
        rol: 'admin',
        estado: 'activo'
    });

    // Doctor
    const hashedDoctor = await bcrypt.hash('doctor01', salt);
    const doctor = new Usuario({
        email: 'doctor@mediconnect.com',
        contraseña: hashedDoctor,
        rol: 'doctor',
        estado: 'activo',
    });

    // Paciente
    const hashedPaciente = await bcrypt.hash('paciente01', salt);
    const paciente = new Usuario({
        email: 'paciente@mediconnect.com',
        contraseña: hashedPaciente,
        rol: 'paciente',
        estado: 'activo'
    });

    await Usuario.insertMany([admin, doctor, paciente]);

    console.log('Usuarios creados con éxito');
    mongoose.disconnect();
};

run();
