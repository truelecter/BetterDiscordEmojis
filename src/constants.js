module.exports.API_BASE = 'https://discordapp.com/api'

function n (id) {
  return webpackJsonp([], [], [id])
}

/* May be changed with discord updates */
module.exports.EMOJI_PICKER_PATH = '#app-mount > div > div:nth-child(7)'
module.exports.LOCAL_STORAGE_MODULE = n(1590)
module.exports.EMOJI_STORAGE_MODULE = n(168).default
module.exports.TRANSLATION_MODULE = n(3)
module.exports.TOKEN_KEY = n(0).TOKEN_KEY
/* May be changed with discord updates.END */

module.exports.ELEMENT_SCROLLER_WRAP = '<div class="scroller-wrap"><div class="scroller"></div></div>'

module.exports.ELEMENT_SEARCH_INPUT = '<input type="text" placeholder="Find the perfect emoji" value="">'

module.exports.ELEMENT_SERVER_EMOJI_LIST = '<span class="server-emojis"><div class="category">server.name</div></span>'
module.exports.ELEMENT_SERVER_EMOJI_LIST_ROW = '<div class="row"></div>'
module.exports.ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY = '<div class="emoji-item"></div>' // max 10 per row

module.exports.REACTION_POPOUT_REGEX = /TOGGLE_REACTION_POPOUT_(\d+)/
module.exports.CURRENT_SELECTED_CHANNEL_REGEX = /.*\/.+\/(\d+)/
module.exports.IS_INBOX_REGEX = /\/channels\/@me\/\d+/
