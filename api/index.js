const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/database')

const express = require('express');
const routes = require('./routes');
const app = express();
const port = process.env.PORTA;

routes(app);

app.listen(port, () => console.log(`O servidor está rodando na porta ${port}`))

module.exports = app;