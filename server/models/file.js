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
		title: String,
		rating: [{
			idUser:String,
			value:Number,
			date: {
				type: Date,
				default: Date.now
			}
		}],
		comments: [{
			author: String,
			text: String,
			date: {
				type: Date,
				default: Date.now
			}
		}],
		downloadsNumber: Number,
		date: {
			type: Date,
			default: Date.now
		}
	});

	return mongoose.model('File', file);
}