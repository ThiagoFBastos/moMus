const db = require('./db');

const Musica = db.sequelize.define('musicas', {
	titulo: {
		type: db.Sequelize.STRING,
		allowNull: false
	},	
	youtube: {
		type: db.Sequelize.STRING
	},
	artista: {
		type: db.Sequelize.STRING,
		allowNull: false
	}
});

//Musica.sync({force: true});

module.exports = Musica;
