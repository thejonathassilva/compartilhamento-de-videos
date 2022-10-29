const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: { type: String },
    email: { type: String },
    senhaHash: { type: String },
    emailVerificado: { type: Boolean }
    }, {
        versionKey: '_version'
    }
)

const usuario = mongoose.model('usuario', usuarioSchema);

module.exports = usuario;