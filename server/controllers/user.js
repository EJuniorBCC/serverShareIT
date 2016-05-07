module.exports = function(app) {

	var User = require('../models/user')(app);
	var fs = require('fs');
	var needle = require('needle');


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
				name: body.name,
				email: body.email

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



		}



	}



	return index


}