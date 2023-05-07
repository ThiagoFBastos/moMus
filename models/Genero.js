const db = require('./db');

const Genero = db.sequelize.define('generos', {
	nome: {
		type: db.Sequelize.STRING,
		allowNull: false,
		unique: true
	}
});

//Genero.sync({force: true});

module.exports = Genero;
