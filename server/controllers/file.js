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
                filePath: '',
                title: body.nameFile,
                rating: [],
                downloadsNumber: 0,
                comments: []

            }



            var fstream;
            req.pipe(req.busboy);

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

                        var mod = {
                            downloadsNumber: data.downloadsNumber + 1
                        }

                        File.update(query, mod, function(err, data) {
                            if (err) {
                                res.json({
                                    status: err
                                });
                            } else {

                            }
                        });

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


            var arr;
            if (req.body.data.length > 0) {
                arr = JSON.parse(req.body.data);
            } else {
                arr = [];
            }
            var arrOr = [];



            for (var i = 0; i < arr.length; i++) {

                arrOr.push({
                    nameFile: arr[i]
                });
            }
            var query = {
                $or: arrOr
            }

            File.find(query, function(err, data) {
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
        getDownloads: function(req, res) {

            var query = {
                _id: req.params.id
            }

            File.findOne(query, function(err, data) {

                if (err) {
                    res.json({
                        status: err
                    });
                } else {
                    if (data) {
                        res.json({
                            status: 'success',
                            data: data.downloadsNumber
                        });

                    } else {
                        res.json({
                            status: 'Arquivo não encontrado'
                        });
                    }

                }

            });

        },
        addRating: function(req, res) {


            console.log(req.body);
            var query = {
                _id: req.body.idFile
            }



            File.findOne(query, function(err, date) {
                if (err) {
                    res.json({
                        status: err
                    });
                } else {

                    if (date) {

                        var rating = date.rating;
                        var flag = false;

                        if (rating.length <= 0) {
                            flag = true;

                            var mod = {
                                $push: {
                                    rating: {
                                        idUser: req.body.idUser,
                                        value: req.body.value
                                    }
                                }

                            }

                            File.update(query, mod, function(err, data) {

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

                        } else {



                            for (var i = 0; i < rating.length; i++) {

                                if (rating[i].idUser == req.body.idUser) {

                                    rating[i].value = req.body.value;
                                    flag = true;

                                    var up = {
                                        rating: rating

                                    }

                                    File.update(query, up, function(err, data) {

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
                            }



                            if (!flag) {

                                var mod = {
                                    $push: {
                                        rating: {
                                            idUser: req.body.idUser,
                                            value: req.body.value
                                        }
                                    }

                                }
                                File.update(query, mod, function(err, data) {

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
                            } else {
                                res.json({
                                    status: 'Usuário já votou!!'
                                });
                            }
                        }


                    } else {
                        res.json({
                            status: 'Arquivo não encontrado'
                        });
                    }
                }

            });



        },
        getRating: function(req, res) {

            var query = {
                _id: req.params.id
            }

            File.findOne(query, function(err, data) {

                if (err) {
                    res.json({
                        status: err
                    });
                } else {
                    if (data) {
                        var mid;

                        if (data.rating.length <= 0) {
                            mid = 1;
                        } else {
                            mid = data.rating.length;
                        }


                        var sum = 0;

                        for (var i = 0; i < data.rating.length; i++) {

                            sum += data.rating[i].value;

                        };

                        sum = sum / mid;

                        res.json({
                            status: 'success',
                            data: sum
                        });
                    } else {
                        res.json({
                            status: 'Arquivo não encontrado'
                        });
                    }

                }
            });
        },
        addComment: function(req, res) {

            var query = {
                _id: req.body.id
            }


            var mod = {

                $push: {
                    comments: {
                        author: req.body.author,
                        text: req.body.text
                    }
                }
            }

            File.update(query, mod, function(err, data) {
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
        getComment: function(req, res) {

            var query = {
                _id: req.params.id
            }

            File.findOne(query, function(err, data) {

                if (err) {
                    res.json({
                        status: err
                    });
                } else {
                    if (data) {

                        res.json({
                            status: 'success',
                            data: data.comments
                        });
                    } else {
                        res.json({
                            status: 'Arquivo não encontrado'
                        });
                    }
                }
            });

        }


    }


    return up


}
