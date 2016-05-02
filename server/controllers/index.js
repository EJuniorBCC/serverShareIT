module.exports = function(app) {
	var mega = require('mega');
	var fs = require('fs');
	var obj = {

		send: function(req, res) {

			var patch = req.body.patch;
			var name = req.body.name;

			var file = mega.file("https://mega.co.nz/#F!2gQAjCiI!N-V-I9xzhzCoCDoO54atrA");


			var storage = mega({
				email: 'luciano.jsjr@gmail.com',
				password: 'shareit@ufrpe'
			}, function(err) {

				if (err) {
					res.json({
						status: err
					});
				} else {
					for (var i = 0; i < storage.root.children.length; i++) {
						console.log(storage.root.children[i].children);
					}
				}

			});

			/*storage.mkdir({
					name: 'naoIndexados'
				},
				function(err, file) {
					if (err) throw err
					console.log('\nCreated', file)
				res.json({
					status:'success'
				})
				}
			)

			fs.createReadStream('server/controllers/text.txt')
				.pipe(storage.upload({
					name: 'text.txt',
					target:'W1JmWRaJ'
				}, function(err, file) {
					if (err) {
						res.json({
							status: err
						});
					} else {
						console.log('Boa');
						res.json({
							status: 'success'
						});
					}
				}));*/



		},
		getFile: function(req, res) {

			var fstream;
			req.pipe(req.busboy);
			req.busboy.on('file', function(fieldname, file, filename) {
				console.log("Uploading: " + filename);
				fstream = fs.createWriteStream(__dirname + '/analisar/' + filename);
				file.pipe(fstream);
				fstream.on('close', function(){
					res.redirect('back');
				});
			});


		}



	}

	return obj;

}