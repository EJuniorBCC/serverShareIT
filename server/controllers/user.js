module.exports = function(app) {

	var User = require('../models/user')(app);
	var fs = require('fs');
	var needle = require('needle');
	var jwt = require('jsonwebtoken');
	var config = require('../config');
	var sanitize = require('mongo-sanitize');


	var index = {
		list: function(req, res) {

			User.find(function(err, data) {

				if (err) {
					res.json({
						status: err
					});
				} else {
					res.json({
						status: 'success',
						data: data
					});
				}

			});

		},

		insert: function(req, res) {

			var body = req.body;

			var fields = {
				name: sanitize(body.name),
				email: sanitize(body.email),
				password: sanitize(body.password)

			}


			var model = User(fields);

			model.save(function(err, data) {

				if (err) {
					res.json({
						status: err
					});
				} else {
					res.json({
						status: 'success',
						data: data
					});
				}

			});



		},
		authentication: function(req, res) {

			var email = sanitize(req.body.email);
			var password = sanitize(req.body.password);

			var query = {
				email: email,
				password: password
			}

			User.findOne(query, function(err, data) {
				if (err) {
					res.json({
						status: err
					});
				} else {
					if (data) {

						var token = jwt.sign(data, config.secret, {
							expiresIn: '24h'
						});


						res.json({
							status: 'success',
							data: {
								token:token,
								name:data.name
							}
						});
					} else {
						res.json({
							status: 'Falha na autenticação'
						});
					}



				}

			});

		}



	}



	return index


}