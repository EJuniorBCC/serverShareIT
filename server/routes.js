module.exports = function(app) {
	
	var file = require('./controllers/file')(app);
	var contact = require('./controllers/contact')(app);


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

			app.get('/app/file',file.list);
			app.post('/app/file/sendFile/:name/:email/:codCurse/:nameCurse/:nameFile/:typeFile/:description',file.sendFile);
			app.get('/app/findFile/:name',file.findFile);
			app.get('/app/index',file.indexFile);
			app.get('/app/find/:key',file.searchDocument);


			app.post('app/contact',contact.insert);
			app.get('app/contact',contact.list);
			




		}
	}
}