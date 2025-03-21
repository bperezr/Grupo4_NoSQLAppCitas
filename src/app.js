const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const calificacionesRoutes = require('./routes/ItemRoutes');

const app = express();

connectDB();

app.use(bodyParser.json());
app.use('/api', calificacionesRoutes);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));