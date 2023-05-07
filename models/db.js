const Sequelize = require('sequelize');

const sequelize = new Sequelize('moMus', 'root', 'G!H9ivRq7fAML6Z', {
	host: 'localhost',
	dialect: 'mysql'
});

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

module.exports = {
	Sequelize: Sequelize,
	sequelize: sequelize
};
