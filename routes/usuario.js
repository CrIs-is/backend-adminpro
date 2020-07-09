var express = require('express');
var bcrypt = require('bcryptjs');
var mdAutentication = require('../middlewares/autenticacion')

var app = express();

//Obteniendo usuarios
var Usuario = require('../models/usuario');


//OBTENER TODOS LOS USUARIOS

app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)
    Usuario.find({}, 'name email img role')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: true,
                    mensaje: 'Error al cargar usuarios',
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) => {

                if (err) {
                    res.status(500).json({
                        ok: true,
                        error: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    total: conteo,
                    usuarios: usuarios
                });
            })


        });

});


//CREAR UN NUEVO USUARIO
app.post('/', mdAutentication.verifyToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al guardar un usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: userSaved,
            user_token: req.usuario
        })
    });
});


//ACTUALIZAR USUARIO
app.put('/:id', mdAutentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Usuarion no encontrado',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario no existe',
                errors: { message: 'No existe un usuarion este id' }
            });
        }

        usuario.name = body.name;
        usuario.email = body.email;
        usuario.role = body.role;


        usuario.save((err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                })
            }

            updatedUser.password = ':)'

            res.status(200).json({
                ok: true,
                usuario: updatedUser
            })
        })
    });


});


//ELIMINAR USUARIO
app.delete('/:id', mdAutentication.verifyToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                errors: err
            })
        }

        if (!userDeleted) {
            return res.status(500).json({
                ok: false,
                message: 'El usuario no se encuentra registrado'
            })
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        })


    })
})

module.exports = app