const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config ({path:'config.env'});
const sequelize = new Sequelize(`postgresql://${process.env.DB_USER}:1234@localhost:5432/smartrabbit?schema=public`)


sequelize.authenticate().then(() => console.log('Connected to PostgreSQL')).catch(err => console.error('Unable to connect to PostgreSQL:', err));

module.exports = sequelize;