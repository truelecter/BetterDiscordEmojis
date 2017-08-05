'use strict';

const { defaultFetchOptions } = require('./constants');
const $ = require('jquery');

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

exports.getClasses = function getClasses(from, what) {
	if (!(what instanceof Array))
		return from[what];

	const res = [];

	for (const key of what) {
		if (typeof from[key] === 'undefined') {
			console.warn(from, `doesn't have property ${key}. Check module numbers`);
		}

		res.push(from[key]);
	}

	return res.join(' ');
};
