var express = require('express');
var mdAutentication = require('../middlewares/autenticacion')

var app = express();

var Hospital = require('../models/hospitales');

app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'name email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    message: 'No se encontro ningun hospital',
                    erro: err
                })
            }

            Hospital.count({}, (err, count) => {

                return res.status(200).json({
                    ok: true,
                    total: count,
                    hospitales: hospitales
                });
            })

        })


});

app.post('/', mdAutentication.verifyToken, (req, res, next) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'El hospital no se pudo guardar',

            });
        };

        return res.status(201).json({
            ok: true,
            message: 'Hospital creado satisfactoriamente',
            hospital: hospitalSaved,

        })
    });


})

app.put('/:id', mdAutentication.verifyToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospitalFound) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar el Hospital',
            });
        }

        if (!hospitalFound) {
            return res.status(500).json({
                ok: false,
                message: 'Error al editar el hospital',
            });
        };

        hospitalFound.nombre = body.nombre;
        //hospitalFound.img = body.img;
        hospitalFound.usuario = req.usuario._id;

        hospitalFound.save((err, hospitalSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Ocurrio un error al guardar el hospital',
                    err: err
                });
            }
            return res.status(201).json({
                ok: true,
                message: 'Registro editado exitosamente',
                hospital: hospitalSaved
            })
        });


    });

})

app.delete('/:id', mdAutentication.verifyToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, HospitalDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                errors: err
            })
        }

        if (!HospitalDeleted) {
            return res.status(500).json({
                ok: false,
                message: 'No exite hospital con ese id'
            })
        }

        res.status(200).json({
            ok: true,
            hospital: HospitalDeleted
        })


    })
})

module.exports = app;