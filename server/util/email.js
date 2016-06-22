var Nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var Q = require('q');


module.exports = {

	sendEmail: function(toEmail, callback) {

		/*

			toEmail = {
				transport:{
					host:String,
					user:String,
					password:String
				},
				mailOptions:{
					from:String,
					to:String,
					subject:String,
					html:String
				}
			}

		*/

		if(toEmail.transport){

		}else{
			toEmail.transport = {
				host:'smtp.gmail.com',
				user: 'shareit.ufrpe@gmail.com',
				password:'shareit2016'
			}
		}

		var defer = Q.defer();


		var transport = Nodemailer.createTransport((smtpTransport({
			host: toEmail.transport.host,
			secureConnection: false, // use SSL
			port: 587, // port for secure SMTP
			auth: {
				user: toEmail.transport.user,
				pass: toEmail.transport.password
			}
		})));

		var mailOptions = {
			from: toEmail.mailOptions.from, // sender address
			to: toEmail.mailOptions.to, // list of receivers
			subject: toEmail.mailOptions.subject, // Subject line
			text: "", // plaintext body
			html:toEmail.mailOptions.html
		}


			transport.sendMail(mailOptions, function(err, response) {
				if (err) {
					defer.reject(err);
				} else {
					console.log(response);
					defer.resolve(response);
				}
			});


		defer.promise.nodeify(callback);
		return defer.promise;

	}
};