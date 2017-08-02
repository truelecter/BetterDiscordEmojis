'use strict';

const Server = require('./server.js');
const Emoji = require('./emoji.js');
const Picker = require('./picker.js');
const {
	API_BASE,
	TOKEN_KEY,
	TRANSLATION_MODULE,
	EMOJI_STORAGE_MODULE,
	LOCAL_STORAGE_MODULE,
	CUSTOM_EMOJI_STORAGE_MODULE,
	SERVERS_STORAGE_MODULE,
	SERVERS_PERMISSIONS_MODULE,
} = require('./constants.js');

function getServers() {
	return new Promise((resolve, reject) => {
		if (!SERVERS_STORAGE_MODULE || !SERVERS_STORAGE_MODULE.getGuilds) {
			reject(new Error('Server storage module is not pointing to server storage'));
		}

		function checkServers() {
			const servers = Object.values(SERVERS_STORAGE_MODULE.getGuilds());
			if (servers.length > 0) {
				resolve(servers);
			}

			setTimeout(checkServers, 1000);
		}

		checkServers();
	});
}

function parseServer({ id, name }) {
	return new Promise((resolve, reject) => {
		if (!SERVERS_PERMISSIONS_MODULE || !SERVERS_PERMISSIONS_MODULE.getGuildPermissions) {
			reject(new Error('Server permission module is not pointing to permission storage'));
		}

		if (!CUSTOM_EMOJI_STORAGE_MODULE ||
			!CUSTOM_EMOJI_STORAGE_MODULE.getDisambiguatedEmojiContext) {
			reject(new Error('Custom emoji storage module is not pointing to custom emoji storage'));
		}

		const server = new Server(id, name, SERVERS_PERMISSIONS_MODULE.getGuildPermissions(id));
		const emojiContext = CUSTOM_EMOJI_STORAGE_MODULE.getDisambiguatedEmojiContext(id);

		// Eventually, CUSTOM_EMOJI_STORAGE_MODULE filters emojis that we can't use by itself!
		resolve(CUSTOM_EMOJI_STORAGE_MODULE.getGuildEmoji(`${id}`)
			.map(e => emojiContext.getById(e.id))
			.filter(e => !!e)
			.reduce(function (server, emoji) {
				server.addEmoji(Emoji.fromRaw(emoji));
				return server;
			}, server)
		);
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

	return getServers()
		.then(parseServers)
		.then(loadStandartEmojis)
		.catch(e => {
			console.error('Error initializing Better Emojis!\nProbably modules order has been changed\n', e);
		});
}

module.exports = doGetEmojis;
