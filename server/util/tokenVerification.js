module.exports = function(req, res, next) {
	var jwt = require('jsonwebtoken');
	var token = '';
	var config = require('../config');

	if (req.headers['token']) {
		token = req.headers['token'];
	}


	jwt.verify(token, config.secret, function(err, data) {
		if (err) {
			res.json({
				status: err
			});
		} else {
			req.decode = data._doc;

			next();

		}
	});


}