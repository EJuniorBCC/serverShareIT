module.exports = function(app) {

		var File = require('../models/file')(app);
		var fs = require('fs');
		var pathIndexar = "/serverShareIT/server/files/indexar/";
		var pathIndexado = "/serverShareIT/server/files/indexado/";
		var needle = require('needle');


		var up = {
				index: function(req, res) {

					File.find(function(err, data) {

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

				sendFile: function(req, res) {

					var body = req.params;

					var fields = {
						name: body.name,
						email: body.email,
						codCurse: body.codCurse,
						nameCurse: body.nameCurse,
						nameFile: body.nameFile,
						typeFile: body.typeFile,
						description: body.description,
						filePath: ''

					}

					console.log(req.body);


					/*var fstream;
					req.pipe(req.busboy);
					req.busboy.on('file', function(fieldname, file, filename) {
							console.log("Uploading: " + filename);
							fstream = fs.createWriteStream(pathIndexar + filename);
							file.pipe(fstream);

							fields.filePath = pathIndexar + filename;

							

								var model = File(fields);

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

							});
						*/


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