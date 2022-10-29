const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const { InvalidArgumentError } = require('../erros');
const bcrypt = require('bcrypt');
const tokens = require('./tokens');
const usuarioController = require('../controllers/usuariosController');
const Usuario = require('./usuarios');

function verificaUsuario(usuario) {
    if(!usuario) {
        throw new InvalidArgumentError('Não existe usuario com esse e-mail');
    }
}

async function verificaSenha(senha, senhaHash) {
    const senhaValida = await bcrypt.compare(senha, senhaHash);
    if(!senhaValida) {
        throw new InvalidArgumentError('Email ou senha inválido')
    }
}

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'senha',
        session: false
    }, async (email, senha, done) => {
        try {
            const usuario = await usuarioController.buscaPorEmail(email);
            verificaUsuario(usuario);
            await verificaSenha(senha, usuarioController.senhaHash);

            done(null, usuario);
        } catch (error) {
            done(error);
        }
    })
);

passport.use(
    new BearerStrategy(
        async (token, done) => {
            try {
                const id = await tokens.acess.verifica(token);
                const usuario = await Usuario.findById(id);
                done(null, usuario, { token: token });
            } catch (error) {
                done(error);
            }
        }
    )
)