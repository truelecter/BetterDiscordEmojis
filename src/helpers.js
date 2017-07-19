'use strict';

const { defaultFetchOptions } = require('./constants');

/**
 * Fetch URL
 *
 * @param {Object} options
 *
 * @return {Promise<mixed>}
 */
exports.fetchURL = function fetchURL(options) {
	return new Promise((resolve, reject) => {
		options = Object.assign({}, defaultFetchOptions, options);

		$.ajax(options).then(resolve).fail(reject);
	});
};
