'use strict';

const Clusterize = require('./lib/clusterize.js');
const Emoji = require('./emoji.js');
const Server = require('./server.js');
const Settings = require('./settings.js');

const { fetchURL } = require('./helpers');
const {
	API_BASE,
	IS_NUMBER_REGEX,
	EMOJI_PICKER_PATH,
	ELEMENT_SCROLLER_WRAP,
	REACTION_POPOUT_REGEX,
	ELEMENT_SERVER_EMOJI_LIST,
	ELEMENT_SERVER_EMOJI_LIST_ROW,
	CURRENT_SELECTED_CHANNEL_REGEX,
	ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY,
	EMOJI_BUTTON_CLASS,
	CHANNEL_TEXTAREA_CLASS
} = require('./constants.js');

let commonEmojisSpansCache = '';

let SCROLLER_WRAP = null;
let SCROLLER_WRAP_OLD = null;
let SEARCH_INPUT = null;

function buildScrollerWrap() {
	const $wrap = SCROLLER_WRAP || $(ELEMENT_SCROLLER_WRAP);
	const $scr = $wrap.find('.scroller');

	$scr.html(' ').off('click').off('mouseenter').off('mouseleave');

	const currentServer = Server.getCurrentServer();

	// Append all current server emojis, if any
	if (currentServer.emojis.length > 0) {
		$scr.append(buildServerSpan(currentServer));
	}

	// Append all other server shared emojis
	if (currentServer.canUseExternalEmojis) {
		for (const server of Server.getAllServers()) {
			if (!server.isCurrent() && server.isShownInPicker()
				&& server.sharedEmojis.length > 0 && IS_NUMBER_REGEX.test(server.id)
			) {
				$scr.append(buildServerSpan(server));
			}
		}
	}

	// Append common emojis
	if (commonEmojisSpansCache) {
		$scr.append(commonEmojisSpansCache);
	}

	window.better_emojis.current_cluster = new Clusterize({
		rows_in_block: 10,
		blocks_in_cluster: 3,
		scrollElem: $scr[0],
		contentElem: $scr[0]
	});

	const emojiClickHandler = $(`.${EMOJI_BUTTON_CLASS}`).hasClass('popout-open')
		? putEmojiInTextarea
		: addCurrentMessageReaction;

	$scr
	.on('click', '.emoji-item', e => {
		console.log('Selected emoji - ', Emoji.getById($(e.target).attr('data-emoji')));
	})
	.on('click', '.emoji-item', e => {
		emojiClickHandler(Emoji.getById($(e.target).attr('data-emoji')));
	})
	.on('mouseenter', '.emoji-item', e => {
		$(e.target).addClass('selected');

		if (SEARCH_INPUT) {
			SEARCH_INPUT.attr('placeholder', Emoji.getById($(e.target).attr('data-emoji')).useName);
		}
	})
	.on('mouseleave', '.emoji-item', e => {
		$(e.target).removeClass('selected');

		if (SEARCH_INPUT) {
			SEARCH_INPUT.attr('placeholder', 'Find the perfect emoji');
		}
	});

	return $wrap;
}

function buildServerSpan(server) {
	const $emojiList = $(ELEMENT_SERVER_EMOJI_LIST);

	$emojiList.find('.category').html(server.name);
	$emojiList.append(buildEmojisRows(server.availableEmojis()));

	return $emojiList.html();
}

function buildEmojisRows(eL) {
	const $emojiList = $('<span class="tl-emoji-list"></span>');
	let $emojiListRow = $(ELEMENT_SERVER_EMOJI_LIST_ROW);

	const emojiElement = function (emoji) {
		return $(ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY)
			.css('background-image', `url("${emoji.url}")`)
			.attr('data-emoji', `${emoji.id}`);
	};

	for (let i = 0; i < eL.length; i++) {
		if ((i !== 0) && (i % 10 === 0)) {
			$emojiList.append($emojiListRow);
			$emojiListRow = $(ELEMENT_SERVER_EMOJI_LIST_ROW);
		}

		$emojiListRow.append(emojiElement(eL[i]));
	}

	$emojiList.append($emojiListRow);

	return $emojiList.html();
}

function putEmojiInTextarea(emoji) {
	const $textarea = $(`.${CHANNEL_TEXTAREA_CLASS} >> textarea`);

	$textarea.val($textarea.val() + emoji.useName + ' ');
}

function findReact(dom) {
	for (const key in dom) {
		if (key.startsWith('__reactInternalInstance$')) {
			return dom[key];
		}
	}

	return null;
};

function getSelectedMessageId() {
	try {
		return REACTION_POPOUT_REGEX.exec(
			findReact($('.btn-reaction.popout-open').closest('.message').find('.message-text').get(0))
			._currentElement.props.children
			.filter(c => (
				Object.keys(c.props).includes('subscribeTo')
			))[0].props.subscribeTo
		)[1];
	} catch (e) {
		return null;
	}
}

function getCurrentSelectedChannel() {
	return CURRENT_SELECTED_CHANNEL_REGEX.exec(window.location.pathname)[1];
}

function addCurrentMessageReaction(emoji) {
	return addMessageReaction(getCurrentSelectedChannel(), getSelectedMessageId(), emoji);
}

function addMessageReaction(channel, message, emoji) {
	return fetchURL({
		url: `${API_BASE}/channels/${channel}/messages/${message}/reactions/:${emoji.name}:${emoji.id}/@me`, //jscs:disable maximumLineLength
		method: 'PUT',
		dataType: 'json',
	});
}

function showOriginalScroller() {
	SCROLLER_WRAP.hide().parent();
	SCROLLER_WRAP_OLD.show();
}

function showCustomScroller() {
	SCROLLER_WRAP.show();
	SCROLLER_WRAP_OLD.hide();
	SCROLLER_WRAP.find('.scroller').scrollTop(0);
}

function replaceScroller() {
	SCROLLER_WRAP = buildScrollerWrap();
	SCROLLER_WRAP_OLD = $(EMOJI_PICKER_PATH).find('.scroller-wrap');
	SCROLLER_WRAP_OLD.hide().before(SCROLLER_WRAP);
}

function replaceSearchInput() {
	// SEARCH_INPUT = buildSearchInput();
	// $(EMOJI_PICKER_PATH).find("input").hide().before(SEARCH_INPUT);
	// Temporary disabled, as original search have much better performance
	let $picker = $(EMOJI_PICKER_PATH);
	SEARCH_INPUT = $picker.find('input');

	SEARCH_INPUT.on('change keydown keyup paste', () => {
		let $wrap = $picker.find('.scroller-wrap, .no-search-results');

		if (SEARCH_INPUT.val()) {
			$wrap.filter('.tl-emoji-scroller-wrap').hide();
			$wrap.not('.tl-emoji-scroller-wrap').show();
		} else {
			$wrap.filter('.tl-emoji-scroller-wrap').show();
			$wrap.not('.tl-emoji-scroller-wrap').hide();
		}
	});
}

function addCustomScrollerParts() {
	// console.log("picker opened");

	setTimeout(() => {
		setTimeout(showCustomScroller, 10);

		replaceScroller();
		replaceSearchInput();

		const categories = $(EMOJI_PICKER_PATH).find('.categories');
		const categoriesChildren = categories.children();
		const customScroller = ['recent', 'custom'];

		categories.on('click', '.item', function (event) {
			const $this = $(this);

			categoriesChildren.removeClass('selected');
			$this.addClass('selected');

			customScroller.forEach(function (category) {
				if ($this.hasClass(category)) {
					showCustomScroller.call(this, event);
				}
			});

			showOriginalScroller.call(this, event);
		});

	}, 20);
}

module.exports.buildServerSpan = buildServerSpan;
module.exports.show = addCustomScrollerParts;

module.exports.setCommonEmojiSpanCache = function (cache) {
	commonEmojisSpansCache = cache;
};
