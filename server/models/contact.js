module.exports = function(app) {
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var contact = Schema({
		name: String,
		email: String,
		message: String,
		subject: String,
		date: {
			type: Date,
			default: Date.now
		}
	});

	return mongoose.model('Contact', contact);
}