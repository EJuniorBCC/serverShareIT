var mongo = require('mongoose');

var inicializar = function () {
    mongo.connect('mongodb://localhost/shareit', function(err) {
        if (err) {
            console.log('erro ao se conectar ao bando de dados', err);
        } else {
            console.log('MongoDB inicializado com sucesso');
        }
    });
}

var secret = 'shareit';

module.exports = {
    start : inicializar,
    secret : secret
}


