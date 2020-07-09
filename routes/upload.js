var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require("fs");

var app = express();

var Usuario = require("../models/usuario");
var Medico = require("../models/medico");
var Hospitales = require("../models/hospitales");
const medico = require('../models/medico');
app.use(fileUpload())

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    var coleccionesValidas = ['hospitales', 'medicos', 'usuarios']

    if (coleccionesValidas.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Coleccion no valida",
            err: { message: "Coleccion no exitente" }
        })
    }

    //Validando si hay imagen
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: "No ha seleccionado archivo",
            err: { message: "Debe selecionar un archivo" }
        })
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1]

    //Extenciones permitidas
    var extencionesValidas = ['png', 'jpg', 'gif', 'jpe']

    //validando extension 
    if (extencionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Estencion no valida",
            err: { message: "solo se permite " + extencionesValidas.join(', ') }
        })
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    //MOver el archivo al path
    var path = `./uploads/${tipo}/${nombreArchivo}`

    archivo.mv(path, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "Error al mover archivo",
                err: err
            })
        }

        subirPortipo(tipo, id, nombreArchivo, res)

    })
})


function subirPortipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {


            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    message: "usuario no existente"

                })
            }


            var pathViejo = './uploads/usuarios/' + usuario.img;

            usuario.password = ':)';

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: "No se pudo eliminar la imagen anterior",
                            err: err,
                        })
                    }

                });
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: "Error al actualizar imagen",
                        err: err
                    })
                }
                return res.status(200).json({
                    ok: true,
                    message: "Imagen actualizada",
                    usuarioActualizado: usuarioActualizado,
                })
            });
        })
    }

    if (tipo == 'medicos') {
        Medico.findById(id, (err, medico) => {


            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    message: "medico no existente"
                })
            }


            var pathViejo = './uploads/medicos/' + medico.img;
            medico.password = ':)';

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: "No se pudo eliminar la imagen anterior",
                            err: err,
                        })
                    }

                });
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: "Error al actualizar imagen",
                        err: err
                    })
                }
                return res.status(200).json({
                    ok: true,
                    message: "Imagen actualizada",
                    medico: medicoActualizado,
                })
            });
        })
    }

    if (tipo == 'hospitales') {
        Hospitales.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: "Hospital no existente"
                })
            }


            var pathViejo = './uploads/hospitales/' + hospital.img;
            hospital.password = ':)';
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, (err) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: "No se pudo eliminar la imagen anterior",
                            err: err,
                        })
                    }

                });
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: "Error al actualizar imagen",
                        err: err
                    })
                }
                return res.status(200).json({
                    ok: true,
                    message: "Imagen actualizada",
                    hospital: hospitalActualizado,
                })
            });
        })


    }
}

module.exports = app;