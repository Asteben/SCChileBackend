const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();

// CORS
app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Directorio publico
app.use(express.static('public'));

// Parseo del body
app.use(express.json());

// Rutas
app.use(require("./routes/auth"));
app.use(require("./routes/alarmas"));
app.use(require("./routes/vecino"));
app.use(require("./routes/contacto"));
app.use(require("./routes/guardia"));
app.use(require("./routes/escoltas"));

app.listen(4000, () => {
    console.log(`Servidor corriendo en puerto ${4000}`);
});