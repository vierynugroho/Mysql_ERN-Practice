import { Sequelize } from 'sequelize';

const db = new Sequelize({
	dialect: 'mysql',
	host: 'localhost',
	username: 'root',
	password: '',
	database: 'practice_mysqlern',
});

if (db) {
	console.log('DB Connected!');
} else {
	console.log('failed Connect to Database');
}

export default db;
