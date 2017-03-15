const Sequelize = require('sequelize');

const Database = require('../PostgreSQL');

const database = new Database();

const UserProfile = database.db.define('userRep', {
	userID: Sequelize.STRING(), // eslint-disable-line new-cap
	reputationType: Sequelize.STRING(), // eslint-disable-line new-cap
	reputationBy: Sequelize.STRING(), // eslint-disable-line new-cap
	reputationMessage: Sequelize.STRING() // eslint-disable-line new-cap
});

UserProfile.sync();

module.exports = UserProfile;
