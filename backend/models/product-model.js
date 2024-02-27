import { Sequelize } from 'sequelize';
import db from '../config/database.js';

const { DataTypes } = Sequelize;
const product = db.define(
	'product',
	{
		name: DataTypes.STRING,
		image: DataTypes.STRING,
		url: DataTypes.STRING,
	},
	{
		freezeTableName: true,
	}
);

export default product;

// cek if !exist
(async () => {
	await db.sync();
})();
