var express = require('express');
var mdAutentication = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');
const { populate } = require('../models/medico');

app.get('/', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'name email')
        .populate('hospital')
        .exec((err, Medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    message: 'Error al cargar medicos',
                    error: err
                });
            }

            Medico.count({}, (err, count) => {
                if (err) {
                    return res.status(200).json({
                        ok: true,
                        medicos: Medicos
                    });
                }
                return res.status(200).json({
                    ok: true,
                    total: count,
                    medicos: Medicos
                });
            })

        })

});

app.post('/', mdAutentication.verifyToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        return res.status(201).json({
            ok: true,
            message: 'Medico guardado',
            medico: medicoSaved
        });
    })

});

app.put('/:id', mdAutentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar el Medico',
            });
        }

        if (!medico) {
            return res.status(500).json({
                ok: false,
                message: 'Error al editar el hospital',
            });
        };

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital

        medico.save((err, medicoSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Ocurrio un error al guardar el medico',
                    err: err
                });
            }
            return res.status(201).json({
                ok: true,
                message: 'Registro editado exitosamente',
                medico: medicoSaved
            })
        });
    })


});


app.delete('/:id', mdAutentication.verifyToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                errors: err
            })
        }

        if (!medicoDeleted) {
            return res.status(500).json({
                ok: false,
                message: 'No exite medico con ese id'
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoDeleted
        })


    })
})


module.exports = app;