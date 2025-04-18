// config/dbAtlas.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://grupo4:VPrLqhoVFg8JM1oW@mediconnect.omjxmo2.mongodb.net/mediConnect?retryWrites=true&w=majority&appName=MediConnect',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log(`\n🍃 \x1b[32m[MongoDB]\x1b[0m Atlas conectado correctamente ✅`);

    } catch (err) {
        console.error('Error al conectar (Atlas):', err);
        process.exit(1);
    }
};

module.exports = connectDB;
