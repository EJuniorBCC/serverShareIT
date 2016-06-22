var Slack = require('slack-node');
var Q = require('q');

var selectChannel = function(id) {
	if (id == 1) {
		return {
			url: 'https://hooks.slack.com/services/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',
			name: '#desenvolvimento'
		};
	}

	return {
		url: 'https://hooks.slack.com/services/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',
		name: "#general"
	};
}


module.exports = {

	sendPost: function(data, callback) {



		var defer = Q.defer();

		if (data.text.length > 0) {

			if (data.channel) {

				var select = selectChannel(data.channel);
			} else {
				var select = selectChannel(0);

			}


			var slack = new Slack();

			slack.setWebhook(select.url);


			slack.webhook({
				channel: select.name,
				username: data.user,
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