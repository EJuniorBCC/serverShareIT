module.exports = function(req, res, next) {
	var jwt = require('jsonwebtoken');
	var token = '';
	var config = require('../config');

	if (req.headers['x-access-token']) {
		token = req.headers['x-access-token'];
	}


	jwt.verify(token, config.secret, function(err, data) {
		if (err) {
			res.json({
				status: 'Token Inválido'
			});
		} else {
			req.decode = data._doc;

			next();

		}
	});


}