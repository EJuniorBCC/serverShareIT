module.exports = function(app) {

	var Contato = require('../models/contato')(app);
	var fs = require('fs');
	var needle = require('needle');


	var index = {
		index: function(req, res) {

			Contato.find(function(err, data) {

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
				name: body.name,
				email: body.email,
				subject: body.subject,
				message: body.message

			}


			var model = Contato(fields);

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
		findFile: function(req, res) {

			var url = 'http://localhost:8080/serverShare/ws/busca?palavra=' + req.params.key;

			console.log(url);

			needle.get(url, function(err, data) {
				if (err) {
					res.json({
						status: err
					})
				} else {

					res.json({
						status: 'success',
						data: data.body
					});
				}
			});

		}



	}


	return up


}