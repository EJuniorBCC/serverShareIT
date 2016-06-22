var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 4000;
var app = express();
var http = require('http');
var Routes = require('./server/routes');
var routes;
var expressValidator = require('express-validator');
var helmet = require('helmet');
var busboy = require('connect-busboy');
var config = require('./server/config');
var allowCors = require('./server/util/allowCors');
var token = require('./server/util/tokenVerification');

var app = express();
var server = http.createServer(app);

app.use(bodyParser.urlencoded({
	limit: '50mb'
}));
app.use(bodyParser.json({
	limit: '50mb'
}));

//app.use('/app',token);


app.use(allowCors);


app.use(busboy());

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(expressValidator());

routes = new Routes(app);
routes.setup();

config.start();


server.listen(port, function() {

	console.log("Servidor iniciado na porta " + port);
});