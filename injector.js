(() => {
	'use strict';

	const http = require('http');
	const https = require('https');
	const { parse: urlParse } = require('url');

	const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36' +
		' (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

	loadScripts();

	function loadScripts() {
		// Skip loading if already loaded
		if (window.better_emojis && window.better_emojis.loaded) {
			return;
		}

		getRawGithub(
			`TrueLecter/BetterDiscordEmojis/master/dependencies.json`
		)
		.then(JSON.parse)
		.then(dependencies => {
			const promises = [];

			for (const dependency of dependencies) {
				promises.push(
					getContent(dependency.url).then(res => (dependency.data = res, dependency))
				);
			}

			return Promise.all(promises);
		})
		.then(dependencies => {
			for (const dependency of dependencies) {
				switch (dependency.type) {
					case 'css':
						addStyle(dependency.data);
						break;
					case 'script':
						addScript(dependency.data);
						break;
				}
			}

			window.better_emojis.loaded = true;

			console.log('Better-emojis scripts loaded');
		})
		.catch((error) => {
			console.log('Loaded scripts error', error);
			console.log('Retrying in 5 seconds...');

			setTimeout(loadScripts, 5000);
		});

		window.better_emojis = {};
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
	 * Adds css at document
	 *
	 * @param {string} css
	 */
	function addStyle(css) {
		const style = document.createElement('style');

		style.innerHTML = css;

		document.head.appendChild(style);
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
			const {
				path,
				hostname,
				protocol
			} = urlParse(url);

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
