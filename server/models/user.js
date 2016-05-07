module.exports = function(app) {
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var user = Schema({
		name: String,
		email: String,
		date: {
			type: Date,
			default: Date.now
		}
	});

	return mongoose.model('User', user);
}