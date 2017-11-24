'use strict';

const N = require('./webpackModuleNumbers.js');

//jscs: disable maximumLineLength
exports.API_BASE = 'https://discordapp.com/api';

/* May be changed with discord updates */
exports.EMOJI_PICKER_PATH = N.EMOJI_PICKER_PATH;
exports.EMOJI_BUTTON_CLASS = n(N.EMOJI_BUTTON_CLASS).emojiButton;
exports.CHANNEL_TEXTAREA_CLASS = n(N.EMOJI_BUTTON_CLASS).channelTextArea;
exports.LOCAL_STORAGE_MODULE = n(N.LOCAL_STORAGE_MODULE); // impl
exports.EMOJI_STORAGE_MODULE = n(N.EMOJI_STORAGE_MODULE).default;
exports.STANDART_EMOJI_CLASS = n(N.EMOJI_STORAGE_MODULE).Emoji;
exports.SERVERS_STORAGE_MODULE = n(N.SERVERS_STORAGE_MODULE); // getGuilds
exports.SERVERS_PERMISSIONS_MODULE = n(N.SERVERS_PERMISSIONS_MODULE); // getGuildPermissions
exports.TRANSLATION_MODULE = n(N.TRANSLATION_MODULE); // Messages
exports.CUSTOM_EMOJI_STORAGE_MODULE = n(N.CUSTOM_EMOJI_STORAGE_MODULE); // getDisambiguatedEmojiContext
exports.TOKEN_KEY = "token"; // This will be manually changed
exports.REACTION_EMOJI_CONVERTER = n(N.REACTION_EMOJI_CONVERTER); // toReactionEmoji
/* May be changed with discord updates.END */

exports.EMOJI_ROW_CATEGORY_HEIGHT = 32;

exports.ELEMENT_SCROLLER_WRAP = '<div class="scroller-wrap tl-emoji-scroller-wrap"><div class="scroller"></div></div>';

exports.ELEMENT_SEARCH_INPUT = '<input type="text" placeholder="Find the perfect emoji" value="">';

exports.ELEMENT_SERVER_EMOJI_LIST = '<span class="server-emojis"><div class="category">server.name</div></span>';
exports.ELEMENT_SERVER_EMOJI_LIST_ROW = '<div class="row"></div>';
exports.ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY = '<div class="emoji-item"></div>'; // max 10 per row

exports.REACTION_POPOUT_REGEX = /TOGGLE_REACTION_POPOUT_(\d+)/;
exports.CURRENT_SELECTED_CHANNEL_REGEX = /.*\/.+\/(\d+)/;
exports.IS_INBOX_REGEX = /\/channels\/@me\/\d+/;

exports.IS_NUMBER_REGEX = /\d+/;

exports.BETTER_EMOJIS_KEY = 'better-emojis';

/**
 * Default options HTTP Fetch jQuery
 *
 * @type {Object}
 */
exports.defaultFetchOptions = {
	method: 'GET',
	crossDomain: true,
};

function n(id) {
	return webpackJsonp([], [], [id]);
}
