var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

var roleValid = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} NO VALIDOS'
};

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    name: { type: String, required: [true, 'name Obligatorio'] },
    email: { type: String, unique: true, required: [true, 'email Obligatorio'] },
    password: { type: String, required: [true, 'password Obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roleValid },
    google: { type: Boolean, required: true, default: false }
});

//decir a moonges que en este esquema estará uniqueValidator
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Usuario', usuarioSchema)