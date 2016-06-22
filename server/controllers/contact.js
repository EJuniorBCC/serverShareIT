module.exports = function(app) {

	var Contact = require('../models/contact')(app);
	var fs = require('fs');
	var needle = require('needle');
	var email = require('../util/email');


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