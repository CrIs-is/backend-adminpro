var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'Este campo es requerido'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El campo es requerido'] },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El campo es requerido'] }
});

module.exports = mongoose.model('Medico', medicoSchema);