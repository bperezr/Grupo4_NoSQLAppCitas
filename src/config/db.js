const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mediConnect');


        console.log(`\n🖥️  \x1b[32m[MongoDB]\x1b[0m Conectado correctamente \x1b[1;35mlocalmente\x1b[0m`);

    } catch (err) {
        console.error('Error al conectar:', err);
        process.exit(1);
    }
};

module.exports = connectDB;