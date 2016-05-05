module.exports = function(app) {

	var File = require('../models/file')(app);
	var fs = require('fs');
	var pathIndexar = "/serverShareIT/server/files/indexar/";
	var pathIndexado = "/serverShareIT/server/files/indexado/";
	//var pathIndexar = 'D:/server_share/server/files/indexar/';
	//var pathIndexado = "D:/server_share/server/files/indexado/";
	var needle = require('needle');
	var str = require('string');
	var map = {
		"â": "a",
		"Â": "A",
		"à": "a",
		"À": "A",
		"á": "a",
		"Á": "A",
		"ã": "a",
		"Ã": "A",
		"ê": "e",
		"Ê": "E",
		"è": "e",
		"È": "E",
		"é": "e",
		"É": "E",
		"î": "i",
		"Î": "I",
		"ì": "i",
		"Ì": "I",
		"í": "i",
		"Í": "I",
		"õ": "o",
		"Õ": "O",
		"ô": "o",
		"Ô": "O",
		"ò": "o",
		"Ò": "O",
		"ó": "o",
		"Ó": "O",
		"ü": "u",
		"Ü": "U",
		"û": "u",
		"Û": "U",
		"ú": "u",
		"Ú": "U",
		"ù": "u",
		"Ù": "U",
		"ç": "c",
		"Ç": "C"
	};



	function removerAcentos(s) {
		return s.replace(/[\W\[\] ]/g, function(a) {
			return map[a] || a
		})
	};


	var up = {

		list: function(req, res) {

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
				nameFile: '',
				typeFile: body.typeFile,
				description: body.description,
				filePath: ''

			}



			var fstream;
			req.pipe(req.busboy);
			if (req.busboy) {
				req.busboy.on('file', function(fieldname, file, filename) {
					console.log("Uploading: " + filename);
					fstream = fs.createWriteStream(pathIndexar + filename);
					file.pipe(fstream);

					var newName = removerAcentos(filename);

					fs.rename(pathIndexar + filename, pathIndexar + newName, function(err, data) {

					});

					fields.filePath = pathIndexado + newName;
					fields.nameFile = newName;

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
			} else {

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

			}


		},
		findFile: function(req, res) {

			var query = {
				nameFile: req.params.name
			}

			File.findOne(query, function(err, data) {

				if (err) {
					res.json({
						status: err
					});
				} else {
					if (data) {

						res.download(data.filePath, data.nameFile);

					} else {
						res.json({
							status: "Arquivo não encontrado"
						});
					}

				}

			});

		},
		indexFile: function(req, res) {
			var exec = require('child_process').exec,
				child;
			child = exec('java -jar /serverShareIT/server/files/indexador.jar',
				function(error, stdout, stderr) {

					if (error !== null) {
						res.json({
							status: 'success',
							data: error
						});
					} else {
						res.json({
							status: stdout
						});
					}


				});



		},
		searchDocument: function(req, res) {

			var exec = require('child_process').exec,
				child;
			child = exec('java -jar /serverShareIT/server/files/buscador.jar ' + req.params.key,
				function(error, stdout, stderr) {

					res.json({
						status: 'success',
						data: stdout
					});

					if (error !== null) {

						res.json({
							status: error
						});
					} else {

					}

				});


		},
		getFileMongo: function(req, res) {

			var arr = JSON.parse(req.query.data);
			var arrOr = [];



			for (var i = 0; i < arr.length; i++) {

				arrOr.push({
					nameFile: arr[i]
				});
			}
			var query = {
				$or: arrOr
			}

			console.log(arrOr);

			File.find(query, function(err, data) {
				if (err) {
					res.json({
						status: err
					});
				} else {
					console.log(data);
					res.json({
						status: data
					});
				}

			});

		}


	}


	return up


}