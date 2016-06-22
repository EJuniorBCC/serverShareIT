module.exports = function(app) {

    var File = require('../models/file')(app);
    var fs = require('fs');
    var pathIndexar = "/serverShareIT/server/files/indexar/";
    var pathIndexado = "/serverShareIT/server/files/indexado/";
    //var pathIndexar = 'D:/server_share/server/files/indexar/';
    //var pathIndexado = "D:/server_share/server/files/indexado/";
    var needle = require('needle');
    var str = require('string');
    var slack = require('../util/slack');
    var removerAcentos = require('../util/map');
    var mongoose = require('mongoose');

    var sendEmail = require('../util/email');

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

            var params = req.params;
            var user = req.decode;
            user = {
                _id: '1',
                email: 'juninhocsm2009@gmail.com'
            }

            var fields = {
                name: params.name,
                email: params.email,
                codCurse: params.codCurse,
                nameCurse: params.nameCurse,
                nameFile: '',
                typeFile: params.typeFile,
                description: params.description,
                status: 'analise',
                filePath: '',
                title: params.nameFile,
                idUser: user._id,
                rating: [],
                downloadsNumber: 0,
                comments: []

            }

            /*toEmail = {

                mailOptions: {
                    from: 'shareit.ufrpe@gmail.com',
                    to: user.email,
                    subject: 'Status Arquivo',
                    html: 'Arquivo em análise'
                }
            }

            sendEmail.sendEmail(toEmail, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('success');
                }
            });*/



            var fstream;
            req.pipe(req.busboy);

            req.busboy.on('file', function(fieldname, file, filename) {
                console.log("Uploading: " + filename);
                fstream = fs.createWriteStream(pathIndexar + filename);
                file.pipe(fstream);

                var newName = removerAcentos(filename);
                var ext = newName.slice(-4);
                fields.typeFile = ext;
                fields.nameFile = newName;


                var model = File(fields);

                model.save(function(err, data) {

                    if (err) {
                        res.json({
                            status: err
                        });
                    } else {

                        newName = data._id + ext;


                        fs.rename(pathIndexar + filename, pathIndexar + newName, function(err, data) {

                        });

                        fields.filePath = pathIndexado + newName;
                        fields.nameFile = newName;
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
                _id: req.params.id
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

            var query = 'java -jar /server_share/server/files/windows/indexador.jar';
            var query_ubuntu = 'java -jar /serverShareIT/server/files/windows/indexador.jar';

            child = exec(query_ubuntu,
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

            var query = 'java -jar /server_share/server/files/windows/buscador.jar ';
            var query_ubuntu = 'java -jar /serverShareIT/server/files/ubuntu/buscador.jar ';
            child = exec(query_ubuntu + req.params.key,
                function(error, stdout, stderr) {


                    if (error !== null) {

                        res.json({
                            status: error
                        });
                    } else {

                        console.log(stdout);
                        var str = stdout.replace(' ', '');
                        str = str.replace('[', '');
                        str = str.replace(']', '');
                        str = str.replace('\n', '');
                        str = str.replace('\r', '');
                        var arr = str.split(',');
                        var ar = [];

                        console.log(arr);

                        if (ar.length <= 0) {

                            var qy = '';

                        } else {

                            for (var i = 0; i < arr.length; i++) {

                                ar.push(mongoose.Types.ObjectId(arr[i].slice(0, -4)));
                            }

                            var qy = {
                                _id: {
                                    $in: ar
                                }
                            }

                        }

                        File.find(qy, {
                            nameFile: 1
                        }, function(err, data) {
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

                });


        },
        getFileMongo: function(req, res) {


            var arr;
            if (req.body.data.length > 0) {
                arr = req.body.data;
            } else {
                arr = [];
            }
            var arrOr = [];



            for (var i = 0; i < arr.length; i++) {

                arrOr.push({
                    _id: arr[i]._id
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

        },
        removeFile: function(req, res) {

            var path = req.body.path;
            var idFile = req.body.idFile;

            fs.unlink(path, function(err, data) {
                if (err) {
                    res.json({
                        status: err
                    });
                } else {
                    res.json({
                        status: 'success'
                    });
                }
            });
        }



    }


    return up


}