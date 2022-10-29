const express = require('express');
const videoController = require('../controllers/videosController.js');
const middlewaresAutenticacao = require('../models/middlewares-autenticacao.js');

const router = express.Router();

router
    .get('/videos', middlewaresAutenticacao.bearer, videoController.listarVideos)
    .get('/videos/free', videoController.listarVideos)
    .get('/videos/:id', middlewaresAutenticacao.bearer, videoController.listarUmVideo)
    .get('/categorias/:id/videos', middlewaresAutenticacao.bearer, videoController.listarVideosDaCategoria)
    .post('/videos', middlewaresAutenticacao.bearer, videoController.cadastrarVideos)
    .put('/videos/:id', middlewaresAutenticacao.bearer, videoController.atualizarVideo)
    .delete('/videos/:id', middlewaresAutenticacao.bearer, videoController.deletarVideo)

module.exports = router;