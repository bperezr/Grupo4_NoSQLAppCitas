const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sucursalesRoutes = require('./routes/sucursalesRoutes');
const bitacoraRoutes = require('./routes/bitacoraRoutes');
const especialidadRoutes = require('./routes/especialidadRoutes');


const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/pages'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mediconnect_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 horas
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    if (req.session.usuario) {
        return res.redirect(`/${req.session.usuario.rol}`);
    }
    res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

app.get('/login', (req, res) => {
    if (req.session.usuario) {
        return res.redirect(`/${req.session.usuario.rol}`);
    }
    res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

app.use((req, res, next) => {
    res.locals.request = req;
    next();
});

app.use('/', authRoutes);
app.use('/', sucursalesRoutes);
app.use('/', bitacoraRoutes);
app.use('/', especialidadRoutes);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));