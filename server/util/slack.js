var Slack = require('slack-node');
var Q = require('q');



module.exports = {

	sendPost: function(data, callback) {

	var defer = Q.defer();

		if (data.text.length > 0) {


			var slack = new Slack();

			slack.setWebhook('https://hooks.slack.com/services/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');


			slack.webhook({
				channel: '#general',
				username: 'ShareIT',
				text: data.text
			}, function(err, response) {
				if (err) {
					defer.reject(err);
				} else {
					defer.resolve(response);
				}
			});


		} else {
			defer.reject('Preencha com um texto válido.');
		}

		defer.promise.nodeify(callback);
		return defer.promise;

	}
};