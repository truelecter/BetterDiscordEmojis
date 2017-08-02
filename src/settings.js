'use strict';

const {
	LOCAL_STORAGE_MODULE,
	BETTER_EMOJIS_KEY,
} = require('./constants.js');

//FIXME empty object returned for require('fs')
const fs = require('fs');
const path = require('path');

const defaultSettings = { enabled: true };

const SETTINGS_HANDLER = {
	get: function (target, name) {
		if (typeof name !== 'string') {
			return undefined;
		}

		const path = name.split('.');
		if (!path.every(e => !!e)) {
			throw Error(`Invalid settings path: ${name}`);
		}

		let obj = target;

		for (const prop of path) {
			obj = obj[prop];

			if (!obj) {
				return obj;
			}
		}

		return obj;
	},

	set: function (target, name, value) {

		if (typeof name !== 'string' || !name) {
			return value;
		}

		const path = name.split('.');
		if (!path.every(e => !!e)) {
			throw Error(`Invalid settings path: ${name}`);
		}

		const lastKey = path.pop();
		let obj = target;

		for (const prop of path) {
			if (!obj[prop]) {
				obj[prop] = {};
			}

			obj = obj[prop];
		}

		obj[lastKey] = value;

		return true;
	}
};

const fileLocation =
	typeof window.betterEmojiLocation !== 'undefined' &&
	fs.readFileSync && fs.writeFileSync && path.resolve ?
	path.resolve(window.betterEmojiLocation, 'config.json') : null;

const settings = new Proxy(Object.assign(defaultSettings, loadSettings()), SETTINGS_HANDLER);

function loadSettings() {
	try {
		return JSON.parse(fs.readFileSync(path.resolve(fileLocation, 'config.json'), 'utf-8'));
	} catch (err) {
		console.log('Error loading settings from file:', err);
		return JSON.parse(LOCAL_STORAGE_MODULE.impl.get(BETTER_EMOJIS_KEY));
	}
}

function saveSettings() {
	if (fileLocation) {
		fs.writeFileSync(path.resolve(fileLocation, 'config.json'), JSON.stringify(settings, null, '\t'));
	} else {
		LOCAL_STORAGE_MODULE.impl.set(BETTER_EMOJIS_KEY, JSON.stringify(settings));
	}
}

exports.set = function (key, value) {
	settings[key] = value;
	saveSettings();
};

function valueOrDefault(value, def) {
	if (value === null || typeof value === 'undefined') {
		return def;
	}

	return value;
}

window.beSettings = exports;

exports.get = function (key, def) {
	return valueOrDefault(settings[key], def);
};
