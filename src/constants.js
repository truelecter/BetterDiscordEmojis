'use strict';

//jscs: disable maximumLineLength
exports.API_BASE = 'https://discordapp.com/api';

/* May be changed with discord updates */
exports.EMOJI_PICKER_PATH = '#app-mount > div > div:nth-child(2) > div:nth-child(5)';
exports.EMOJI_BUTTON_CLASS = n(5716).emojiButton;
exports.CHANNEL_TEXTAREA_CLASS = n(5716).channelTextArea;
exports.LOCAL_STORAGE_MODULE = n(2586); // impl
exports.EMOJI_STORAGE_MODULE = n(187).default;
exports.STANDART_EMOJI_CLASS = n(187).Emoji;
exports.SERVERS_STORAGE_MODULE = n(16); // getGuilds
exports.SERVERS_PERMISSIONS_MODULE = n(49); // getGuildPermissions
exports.TRANSLATION_MODULE = n(3); // Messages
exports.CUSTOM_EMOJI_STORAGE_MODULE = n(208); // getDisambiguatedEmojiContext
exports.TOKEN_KEY = n(1).TOKEN_KEY;
exports.REACTION_EMOJI_CONVERTER = n(326); // toReactionEmoji
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
