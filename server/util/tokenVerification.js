module.exports = function(req, res, next) {
	var jwt = require('jsonwebtoken');
	var token = '';
	var config = require('../config');

	if (req.params.token) {
		token = req.params.token
	}


	jwt.verify(token, config.secret, function(err, data) {
		if (err) {
			res.json({
				status: 'Token Inválido'
			});
		} else {

			next();

		}
	});


}