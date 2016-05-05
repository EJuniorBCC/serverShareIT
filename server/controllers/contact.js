module.exports = function(app) {

	var Contact = require('../models/contact')(app);
	var fs = require('fs');
	var needle = require('needle');


	var index = {
		index: function(req, res) {

			Contact.find(function(err, data) {

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


			var model = Contact(fields);

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