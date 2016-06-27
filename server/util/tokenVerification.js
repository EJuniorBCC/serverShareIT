module.exports = function(req, res, next) {
	var jwt = require('jsonwebtoken');
	var token = '';
	var config = require('../config');

	console.log(req.params);

	if (req.params.token) {
		token = req.params.token
	}

	console.log(token);


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