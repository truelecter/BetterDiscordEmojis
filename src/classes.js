'use strict';

const N = require('./webpackModuleNumbers.js');

exports.SETTINGS_CLASSES = n(N.SETTINGS_CLASSES);
exports.SWITCH_CLASSES = n(N.SWITCH_CLASSES);
exports.FLEX_CHILD_CLASSES = n(N.FLEX_CHILD_CLASSES);
exports.FLEX_CLASSES = n(N.FLEX_CLASSES);
exports.HEADER_CLASSES = n(N.HEADER_CLASSES);
exports.SWITCH_ITEM_CLASSES = n(N.SWITCH_ITEM_CLASSES);
exports.DIVIDER_ITEM_CLASSES = n(N.DIVIDER_ITEM_CLASSES);
exports.LABEL_ITEM_CLASSES = n(N.LABEL_ITEM_CLASSES);
exports.FONT_SIZE_CLASSES = n(N.FONT_SIZE_CLASSES);
exports.CARD_CLASSES = n(N.CARD_CLASSES);

exports.SIDEBAR_BUTTON_CLASS = 'be-settings-button';
exports.SERVER_CARD_CLASSES = {
	showInPicker: 'be-server-show-in-picker',
	showInPickerSwitch: 'be-server-show-in-picker-switch',
	showInServerList: 'be-server-show-in-server-list',
	showInServerListSwitch: 'be-server-show-in-server-list-switch',
	serverCard: 'be-server-card',
	icon: 'be-server-icon',
};

function n(id) {
	return webpackJsonp([], [], [id]);
}
