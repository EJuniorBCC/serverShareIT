module.exports = function(app) {
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var id = mongoose.Schema.Types.ObjectId;

	var file = Schema({
		name: String,
		email: String,
		codCurse: String,
		nameCurse: String,
		nameFile: String,
		typeFile: String,
		description: String,
		filePath: String,
		date: {
			type: Date,
			default: Date.now
		}
	});

	return mongoose.model('File', file);
}