var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 4000;
var app = express();
var http = require('http');
var Routes = require('./server/routes');
require('events').EventEmitter.prototype._maxListeners = 1000;
var routes;
var expressValidator = require('express-validator');
var helmet = require('helmet');
var busboy = require('connect-busboy');
var Mongo = require('./server/config')


var app = express();
var server = http.createServer(app);


app.use(busboy()); 

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(expressValidator());

routes = new Routes(app);
routes.setup();

mongo = new Mongo(app);
mongo.inicializar();	


server.listen(port, function() {

	console.log("Servidor iniciado na porta " + port);
});