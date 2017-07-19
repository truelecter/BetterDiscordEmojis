'use strict';

const Server = require('./server.js');
const Emoji = require('./emoji.js');
const Picker = require('./picker.js');
const { fetchURL } = require('./helpers.js');
const {
	API_BASE,
	TOKEN_KEY,
	TRANSLATION_MODULE,
	EMOJI_STORAGE_MODULE,
	LOCAL_STORAGE_MODULE
} = require('./constants.js');

let MY_ID = '';

function getServers() {
	return fetchURL({
		url: `${API_BASE}/users/@me/guilds`,
		dataType: 'json'
	});
}

function getMyId() {
	return fetchURL({
		url: `${API_BASE}/users/@me`,
		dataType: 'json'
	})
	.then((response) => {
		MY_ID = response.id;

		return response;
	});
}

function parseServer({ id: serverId, permissions: serverPermissions }) {
	return fetchURL({
		url: `${API_BASE}/guilds/${serverId}/members/${MY_ID}`,
		dataType: 'json'
	})
	.then(({ roles }) => (
		fetchURL({
			url: `${API_BASE}/guilds/${serverId}`,
			dataType: 'json'
		})
		.then(({ id, name, emojis }) => ({
			id,
			name,
			roles,
			emojis
		}))
	))
	.then(({ id, name, emojis, roles }) => {
		// now we got detailed info about server. fill emoji and managed emojis.
		// also set name
		const server = new Server(id, name, serverPermissions);

		for (const emoji of emojis.map(Emoji.fromRaw)) {
			const emojiRoles = emoji.roles;

			if (!emojiRoles.length) {
				server.addEmoji(emoji);

				continue;
			}

			for (const role of emojiRoles) {
				if (roles.includes(role)) {
					server.addEmoji(emoji);

					break;
				}
			}
		}

		return server;
	});
}

function parseServers(serversA) {
	return Promise.all(serversA.map(parseServer));
}

function loadStandartEmojis() {
	let commonEmojis = [];

	const translation = TRANSLATION_MODULE.Messages;
	const categories = EMOJI_STORAGE_MODULE.getCategories();
	let $commonEmojisSpansCacheSpan = $('<span></span>');

	for (let category of categories) {
		const tr = translation[`EMOJI_CATEGORY_${category.toUpperCase()}`];
		const fakeServer = new Server(tr, tr, 0x00040000);

		const emojis = EMOJI_STORAGE_MODULE.getByCategory(category);

		for (let emoji of emojis) {
			fakeServer.addEmoji(
				new Emoji(
					emoji.uniqueName,
					emoji.uniqueName,
					emoji.managed,
					emoji.allNamesString.includes(':'),
					[],
					emoji.defaultUrl
				)
			);
		}

		commonEmojis.push(fakeServer);
		$commonEmojisSpansCacheSpan.append(Picker.buildServerSpan(fakeServer));
	}

	return Promise.resolve({
		emojis: commonEmojis,
		spanCache: $commonEmojisSpansCacheSpan.html()
	});
}

function doGetEmojis() {
	const token = LOCAL_STORAGE_MODULE.impl.get(TOKEN_KEY);

	$.ajaxSetup({
		crossDomain: true,
		headers: {
			authorization: token
		}
	});

	return getMyId()
		.then(getServers)
		.then(parseServers)
		.then(loadStandartEmojis)
		.catch(e => {
			console.error('Error initializing Better Emojis!\nProbably modules order has been changed\n', e);
		});
}

module.exports = doGetEmojis;
