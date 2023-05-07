const db = require('./db');
const Filme = require('./Filme');
const Musica = require('./Musica');

const FilmeMusica = db.sequelize.define('filmes_musicas', {});

Musica.belongsToMany(Filme, {through: FilmeMusica});
Filme.belongsToMany(Musica, {through: FilmeMusica})
//FilmeMusica.sync({force: true});

module.exports = FilmeMusica; 
