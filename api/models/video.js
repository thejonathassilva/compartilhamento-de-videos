const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    titulo: {type: String},
    descricao: {type: String},
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'categorias', required: false },
    url: {type: String}
    }, {
        versionKey: '_version'
    }
)

const videos = mongoose.model('video', videoSchema);

module.exports = videos;