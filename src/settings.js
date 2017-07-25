'use strict';

const {
	LOCAL_STORAGE_MODULE,
	BETTER_EMOJIS_KEY,
} = require('./constants.js');

//FIXME empty object returned for require('fs')
const fs = require('fs');
const path = require('path');

const defaultSettings = {enabled: true};

const fileLocation = typeof window.betterEmojiLocation !== 'undefined' && fs.readFileSync && fs.writeFileSync ? 
	path.resolve(window.betterEmojiLocation, 'config.json') : null;

const loadedSettings = loadSettings();

const settings = Object.assign(defaultSettings, loadedSettings);

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

exports.get = function (key) {
	return settings[key] || null;
};
