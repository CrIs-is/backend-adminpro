var express = require('express');

var app = express();

var Hospital = require('../models/hospitales');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

///////////////////////
//Busqueda especifica
///////////////////////

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var table = req.params.tabla;
    var busqueda = req.params.busqueda;

    var regexp = new RegExp(busqueda, 'i');

    var promesa;

    switch (table) {
        case 'medicos':
            promesa = buscarMedicos(busqueda, regexp)

            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regexp)

            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regexp)

            break;

        default:
            res.status(400).json({
                ok: false,
                message: 'buscando coleccion no existente'
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [table]: data
        })
    })


})

//Rutas
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');


    Promise.all([buscarHospitales(busqueda, regexp), buscarMedicos(busqueda, regexp), buscarUsuarios(busqueda, regexp)])
        .then((response) => {
            res.status(200).json({
                ok: true,
                hospitales: response[0],
                medicos: response[1],
                usuarios: response[2],
            });
        });


});

function buscarHospitales(busqueda, regexp) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regexp })
            .populate('usuario', 'name email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales)
                }
            });
    })
}

function buscarMedicos(busqueda, regexp) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regexp })
            .populate('usuario', 'name email')
            .populate('hospital', 'nombre')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(medicos)
                }
            });
    })

}

function buscarUsuarios(busqueda, regexp) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'name email role')
            .or([{ 'name': regexp }, { 'email': regexp }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(usuarios)
                }
            })
    })

}


module.exports = app;