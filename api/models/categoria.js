const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    titulo: { type: String },
    cor: { type: String }
})

const categorias = mongoose.model('categorias', categoriaSchema);

module.exports = categorias;