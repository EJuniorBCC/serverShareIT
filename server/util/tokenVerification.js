module.exports = function(req, res, next) {
	var jwt = require('jsonwebtoken');
	var token = '';
	var config = require('../config');


	if (req.body.token) {
		token = req.body.token
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