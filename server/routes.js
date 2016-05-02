module.exports = function(app) {
	
	var file = require('./controllers/file')(app);


	function allowCORS(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'content-type, Authorization, Content-Length, X-Requested-With, Origin, Accept, x-access-token');
		//res.header('Access-Control-Allow-Headers', '*');

		if ('OPTIONS' === req.method) {
			res.status(200).end();
		} else {
			next();
		}
	}

	return {
		setup: function() {
			app.use(allowCORS);

			app.get('/app/file',file.index);
			app.post('/app/file/sendFile/:name/:email/:codCurse/:nameCurse/:nameFile/:typeFile/:description',file.sendFile);
			app.post('/app/findFile/:key',file.findFile);
			




		}
	}
}