const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mediConnect');

        console.log('Conectado correctamente');
    } catch (err) {
        console.error('Error al conectar:', err);
        process.exit(1);
    }
};

module.exports = connectDB;