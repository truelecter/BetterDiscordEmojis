(() => {
	'use strict';

	const http = require('http');
	const https = require('https');
	const { parse: urlParse } = require('url');

	const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36'
	+ ' (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

	loadScripts();

	function loadScripts() {
		// Skip loading if already loaded
		if (window.better_emojis && window.better_emojis.loaded) {
			return;
		}

		window.better_emojis = {};

		getContent(
			'https://api.github.com/repos/TrueLecter/BetterDiscordEmojis/git/refs/heads/master'
		)
		.then(JSON.parse)
		.then(({ object: { sha: commitId } }) => (
			Promise.all([
				getRawGithub(
					`TrueLecter/BetterDiscordEmojis/${commitId}/jquery.js`
				),
				getRawGithub(
					`TrueLecter/BetterDiscordEmojis/${commitId}/better-emojis.js`
				)
			])
		))
		.then(([jQuery, betterEmojis]) => {
			if (!window.better_emojis.jquery) {
				addScript(jQuery);

				window.better_emojis.jquery = true;
			}

			if (!window.better_emojis.be) {
				addScript(betterEmojis);

				window.better_emojis.be = true;
			}

			window.better_emojis.loaded = true;

			console.log('Better-emojis scripts loaded');
		})
		.catch((error) => {
			console.log('Loaded scripts error', error);
			console.log('Retrying in 5 seconds...');

			setTimeout(loadScripts, 5000);
		});
	}

	/**
	 * Adds js at document
	 *
	 * @param {string} js
	 */
	function addScript(js) {
		const script = document.createElement('script');

		script.innerHTML = js;

		document.head.appendChild(script);
	}

	/**
	 * Returns github raw files
	 *
	 * @param {string} path
	 *
	 * @return {Promise<string>}
	 */
	function getRawGithub(path) {
		path = 'https://raw.githubusercontent.com/' + path;

		return getContent(path);
	}

	/**
	 * Fetch content with HTTP
	 *
	 * @param {string}  url
	 *
	 * @return {Promise<string>}
	 */
	function getContent(url) {
		return new Promise((resolve, reject) => {
			const { path, hostname, protocol } = urlParse(url);

			const resolver = protocol === 'https:' ? https : http;

			const options = {
				path,
				hostname,
				headers: {
					'User-Agent': USER_AGENT
				}
			};

			resolver.get(options, (response) => {
				if (response.statusCode < 200 || response.statusCode > 299) {
					return reject(
						new Error(`Failed to load page, status code: ${response.statusCode}`)
					);
				}

				let body = '';

				response
				.on('data', (chunk) => body += chunk)
				.on('end', () => resolve(body));

			})
			.on('error', reject);
		});
	}
})();
