const video = require("../models/video.js");
const categoria = require('../models/categoria.js')
const { InvalidArgumentError } = require('../erros')
const validacoes = require('../validacoes-comum');
 
class videoController {

    static async listarVideos(req, res) {
        const { search } = req.query;
        const limitValue = req.query.limit || 5;
        const pageValue = req.query.page || 1;
        const skipValue = (pageValue - 1) * limitValue;
        let where = {};
        if(search) {
            where = { titulo: search }
        }
        try {
            const todosOsVideos = await video.find(where).populate('categoria').limit(limitValue).skip(skipValue);
            return res.status(200).json(todosOsVideos);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async listarUmVideo(req, res) {
        const { id } = req.params;
        try {
            const umVideo = await video.findById(id).populate('categoria');
            return res.status(200).json(umVideo);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }    

    static async listarVideosDaCategoria(req, res) {
        const { id } = req.params;
        try {
            const categoriaSelecionada = await categoria.findById(id);
            const videosDaCategoria = await video.find( { categoria: { $eq: categoriaSelecionada } } )
            return res.status(200).json(videosDaCategoria);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async cadastrarVideos(req, res) {
        let novoVideo = req.body;
        if(!novoVideo.categoria) {
            novoVideo.categoria = '63570eb72461dcc469a45e06';
        }
        try {
            validacoes.campoStringNaoNulo(novoVideo.titulo, 'titulo');
            validacoes.campoTamanhoMinimo(novoVideo.titulo, 'titulo', 3)
            validacoes.campoStringNaoNulo(novoVideo.descricao, 'descricao');
            validacoes.campoStringNaoNulo(novoVideo.url, 'url');
            const videoCriado = await video.create(novoVideo);
            return res.status(200).json(videoCriado);
        } catch (error) {
            console.log(error)
            if (error instanceof InvalidArgumentError) {
                return res.status(422).json({ error: error.message });
            } else {
                return res.status(500).json(error.message);
            }
        }
    }

    static async atualizarVideo(req, res) {
        const { id } = req.params;
        try {
            await video.findByIdAndUpdate(id, {$set: req.body})
            const videoAtualizado = await video.findById(id);
            return res.status(200).json(videoAtualizado);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async deletarVideo(req, res) {
        const { id } = req.params;
        try {
            await video.findByIdAndDelete(id);
            return res.status(200).json({ message: `Video de id ${id} deletado com sucesso!` })            
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

module.exports = videoController;