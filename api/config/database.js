const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
mongoose.connect("mongodb+srv://compartilhamento-de-vid.wf6zvg4.mongodb.net", {
    // "auth": { "authSource": "admin" },
    user: process.env.USER_MONGO,
    pass: process.env.PASSWORD_MONGO,
    dbName: 'compartilhamento-de-videos'
});
let db = mongoose.connection;

module.exports = db;