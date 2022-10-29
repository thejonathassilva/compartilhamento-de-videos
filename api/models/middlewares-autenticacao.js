const passport = require('passport');
const usuario = require('./usuarios');
const tokens = require('./tokens');
const { verificacaoEmail } = require('./tokens');

module.exports = {
    local: (req, res, next) => {
        passport.authenticate(
            'local', { session: false },
            (error, usuario, info) => {
                if (error && error.name == 'InvalidArgumentError') {
                    return res.status(401).json({ error: error.message });
                }
                if(error) {
                    return res.status(500).json({ error: error.message });
                }
                if(!usuario) {
                    return res.status(401).json();
                }

                req.user = usuario;
                return next();
            }
        )(req, res, next);
    },

    bearer: (req, res, next) => {
        passport.authenticate(
            'bearer',
            { session: true },
            (error, usuario, info) => {
                if (error && error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: error.message });
                }

                if (error && error.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: error.message });
                }

                if(error) {
                    return res.status(500).json({ error: error.message });
                }
                if(!usuario) {
                    return res.status(401).json();
                }

                req.token = info.token;
                res.user = usuario;
            }
        )(req, res, next);
    },

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const id = await tokens.refresh.verifica(refreshToken);
            await tokens.refresh.invalida(refreshToken);
            req.user = await usuario.findById(id);
            return next();
        } catch (error) {
            if(error.name === 'InvalidArgumentError') {
                return res.status(401).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    },

    async verificacaoEmail(req, res, next) {
        try {
            const { token } = req.params;
            const id = await tokens.verificacaoEmail.verifica(token);
            const usuario = await usuario.findById(id);
            req.user = usuario;
            next();
        } catch(error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: error.message });
            } if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: error.message, expiradoEm: error.expiredAt
                });
            }
            return res.status(500).json({ error: error.message })
        }
    }
}