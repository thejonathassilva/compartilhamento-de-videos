const express = require('express');
const categoriaController = require('../controllers/categoriasController.js');
const middlewaresAutenticacao = require('../models/middlewares-autenticacao.js');

const router = express.Router();

router
    .get('/categorias', middlewaresAutenticacao.bearer, categoriaController.listarCategorias)
    .get('/categorias/:id', middlewaresAutenticacao.bearer, categoriaController.listarUmaCategoria)
    .post('/categorias', middlewaresAutenticacao.bearer, categoriaController.cadastrarCategoria)
    .put('/categorias/:id', middlewaresAutenticacao.bearer, categoriaController.atualizarCategoria)
    .delete('/categorias/:id', middlewaresAutenticacao.bearer, categoriaController.deletarCategoria)

module.exports = router;