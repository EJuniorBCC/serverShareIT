function allowCORS(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'content-type, Authorization, Content-Length, X-Requested-With, Origin, Accept, x-access-token');
	res.header('Access-Control-Allow-Headers', '*');
	if ('OPTIONS' === req.method) {
		res.status(200).end();
	} else {
		next();
	}
}

module.exports = allowCORS;