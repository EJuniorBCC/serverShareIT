module.exports = function(app) {

	var file = require('./controllers/file')(app);
	var contact = require('./controllers/contact')(app);
	var user = require('./controllers/user')(app);



	return {
		setup: function() {

			app.get('/app/file', file.list);
			app.post('/admin/fileOpen/',file.listFiles);
			app.post('/app/file/sendFile/:name/:email/:codCurse/:nameCurse/:nameFile/:typeFile/:description', file.sendFile);
			app.get('/app/findFile/:id', file.findFile);
			app.post('/admin/index/', file.indexFile);
			app.get('/app/find/:key', file.searchDocument);
			app.post('/app/findMongo', file.getFileMongo);
			app.post('/app/addRating/', file.addRating);
			app.get('/app/getRating/:id', file.getRating);
			app.post('/app/addComment', file.addComment);
			app.get('/app/getComment/:id', file.getComment);
			app.get('/app/getDownloads/:id', file.getDownloads);
			app.post('/admin/removeFile/', file.removeFile);



			app.post('/app/contact', contact.insert);
			app.get('/app/contact', contact.list);
			app.get('/app/sendEmail', contact.sendEmail);

			app.post('/app/user', user.insert);

			app.post('/auth', user.authentication);
			//app.get('/app/user', user.list);



		}
	}
}