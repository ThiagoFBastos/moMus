const db = require('./db');
const Filme = require('./Filme');
const Genero = require('./Genero');

const FilmeGenero = db.sequelize.define('filmes_generos', {});

Filme.belongsToMany(Genero, {through: FilmeGenero});
Genero.belongsToMany(Filme, {through: FilmeGenero});

//FilmeGenero.sync({force: true});

module.exports = FilmeGenero;
