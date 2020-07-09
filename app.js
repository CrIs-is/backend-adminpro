//Requires
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser');

//Inicializar variables

var app = express();

//BodyParser

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Importando Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicosRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//Coneccion a mongoDb
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
})

//server index config
//var serverIndex = require('serve-index');
//appRoutes.use(express.static(__dirname + '/'));
//app.use('/uploads', serverIndex(__dirname + '/uploads'));


//Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospitales', hospitalRoutes);
app.use('/medicos', medicosRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);


//Escuchar peticiones
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online')
})