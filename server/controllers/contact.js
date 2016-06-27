module.exports = function(app) {

	var Contact = require('../models/contact');
	var fs = require('fs');
	var needle = require('needle');
	var email = require('../util/email');
	var sanitize = require('mongo-sanitize');


	var index = {
		list: function(req, res) {

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
				name: sanitize(body.name),
				email: sanitize(body.email),
				subject: sanitize(body.subject),
				message: sanitize(body.message)

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



		},
		sendEmail: function(req,res){


			var toEmail = {
				transport:{
					host:"smtp.gmail.com",
					user:'farmazap.cadastro@gmail.com',
					password:'Farma@zap$'
				},
				mailOptions:{
					from:"Farmazap <farmazap.cadastro@gmail.com>",
					to:'juninhocsm2009@gmail.com',
					subject:"Confirmação de email",
					html:"Link para confirmação: <a>Clique aqui</a>"
				}
			}

			email.sendEmail(toEmail,function(err,resp){
				if(err){
					res.json({
						status:err
					});
				}else{
					res.json({
						status:'success',
						data:resp
					});
				}

			});



		}



	}



	return index


}