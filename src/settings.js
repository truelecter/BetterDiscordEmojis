'use strict';

const {
	LOCAL_STORAGE_MODULE,
	BETTER_EMOJIS_KEY,
} = require('./constants.js');

const fs = require('fs');
const path = require('path');

const defaultSettings = {};

const fileLocation = typeof window.betterEmojiLocation == 'undefined' ? null :
	path.resolve(window.betterEmojiLocation, 'config.json');

const loadedSettings = loadSettings();

const settings = Object.assign(defaultSettings, loadedSettings);

function loadSettings() {
	try {
		return JSON.parse(fs.readFileSync(path.resolve(fileLocation, 'config.json'), 'utf-8'));
	} catch (err) {
		console.log('Error loading settings from file:', err);
		return JSON.parse(LOCAL_STORAGE_MODULE.get(BETTER_EMOJIS_KEY));
	}
}

function saveSettings() {
	if (fileLocation) {
		fs.writeFileSync(path.resolve(fileLocation, 'config.json'), JSON.stringify(settings, null, '\t'));
	} else {
		LOCAL_STORAGE_MODULE.set(BETTER_EMOJIS_KEY, JSON.stringify(settings));
	}
}

exports.set = function (key, value) {
	settings[key] = value;
	saveSettings();
};

exports.get = function (key) {
	return settings[key] || null;
};
