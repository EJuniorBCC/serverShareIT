module.exports = function(app) {
    var mongo = require('mongoose');

    function inicializar() {
        mongo.connect('mongodb://localhost/shareit', function(err) {
            if (err) {
                console.log('erro ao se conectar ao bando de dados', err);
            } else {
                console.log('MongoDB inicializado com sucesso');
            }
        });
    }

    return {
        inicializar: inicializar
    }
}