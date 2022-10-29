const bodyParser = require('body-parser');
const categorias = require('./categoriasRoutes');
const videos = require('./videosRoutes');
const usuarios = require('./usuariosRoutes')

const router = (app) => {
    app.use(bodyParser.json());
    app.use(videos);
    app.use(categorias);
    app.use(usuarios);
    app.get('/', (req, res) => res.send('Testes'));

}

module.exports = router;