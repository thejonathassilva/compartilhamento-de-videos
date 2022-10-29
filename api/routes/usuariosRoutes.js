const express = require('express');
const middlewaresAutenticacao = require('../models/middlewares-autenticacao')
const usuarioController = require('../controllers/usuariosController');

const router = express.Router();

router
    .post('/usuario', usuarioController.criarUsuario)
    .post('/usuario/atualiza_token', middlewaresAutenticacao.refresh, usuarioController.login)
    .post('/usuario/login', middlewaresAutenticacao.local, usuarioController.login)
    .post('/usuario/logout', [middlewaresAutenticacao.refresh, middlewaresAutenticacao.bearer], usuarioController.logout)
    .put('/categorias/:id', middlewaresAutenticacao.bearer, usuarioController.atualizaUsuario)
    .delete('/categorias/:id', middlewaresAutenticacao.bearer, usuarioController.deletaUsuario)

module.exports = router;