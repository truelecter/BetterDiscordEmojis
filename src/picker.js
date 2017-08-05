'use strict';

const JsSearch = require('js-search');
const $ = require('jquery')
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
	CHANNEL_TEXTAREA_CLASS,
	CUSTOM_EMOJI_STORAGE_MODULE,
	TRANSLATION_MODULE,
	STANDART_EMOJI_CLASS,
	EMOJI_ROW_CATEGORY_HEIGHT,
	EMOJI_STORAGE_MODULE,
} = require('./constants.js');

let commonEmojisSpansCache = '';
let categoriesHeight = {};
let commonEmojis = [];

let SCROLLER_WRAP = null;
let SCROLLER_WRAP_OLD = null;
let SEARCH_INPUT = null;

function buildScrollerWrap() {
	return new Promise((resolve, reject) => {
	const $wrap = SCROLLER_WRAP || $(ELEMENT_SCROLLER_WRAP);
	const $scr = $wrap.find('.scroller');
	const currentServer = Server.getCurrentServer();
	const serverContext = CUSTOM_EMOJI_STORAGE_MODULE.getDisambiguatedEmojiContext(currentServer.id);
	let customEmojisHeight = 0;

	$scr.html(' ').off('click').off('mouseenter').off('mouseleave');

	if (Settings.get('picker.frequently-used.enabled', true)) {
		const freqUsed = serverContext.getFrequentlyUsedEmojis()
			.map(e => e instanceof STANDART_EMOJI_CLASS ? Emoji.getById(e.uniqueName) : Emoji.getById(e.id))
			.filter(e => !!e);

		if (freqUsed.length > 0) {
			const span = buildServerSpan({
				name: TRANSLATION_MODULE.Messages.EMOJI_CATEGORY_RECENT,
			}, freqUsed);

			customEmojisHeight += EMOJI_ROW_CATEGORY_HEIGHT * (1 + Math.ceil(freqUsed.length / 10.0));
			$scr.append(span);
		}
	}

	// Append all current server emojis, if any
	if (currentServer.emojis.length > 0) {
		const emojis = currentServer.availableEmojis();

		customEmojisHeight += EMOJI_ROW_CATEGORY_HEIGHT * (1 + Math.ceil(emojis.length / 10.0));
		$scr.append(buildServerSpan(currentServer, emojis));
	}

	// Append all other server shared emojis
	if (currentServer.canUseExternalEmojis) {
		for (const server of Server.getAllServers()) {
			let availableEmojis = server.availableEmojis();

			if (!server.isCurrent()
				&& server.isShownInPicker()
				&& IS_NUMBER_REGEX.test(server.id)
				&& availableEmojis.length > 0
			) {
				customEmojisHeight +=
					EMOJI_ROW_CATEGORY_HEIGHT * (1 + Math.ceil(availableEmojis.length / 10.0));
				$scr.append(buildServerSpan(server, availableEmojis));
			}
		}
	}

	categoriesHeight.custom = customEmojisHeight;
	replaceCategories();

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
		const emoji = Emoji.getById($(e.target).attr('data-emoji'));

		if (emoji.isCustom()) {
			emojiClickHandler(serverContext.getById($(e.target).attr('data-emoji')));
		} else {
			emojiClickHandler(emoji);
		}
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

	resolve($wrap);
	});
}

function buildServerSpan(server, availableEmojis) {
	const $emojiList = $(ELEMENT_SERVER_EMOJI_LIST);
	const emojis = availableEmojis || server.availableEmojis();

	$emojiList.find('.category').html(server.name);
	$emojiList.append(buildEmojisRows(emojis));

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

	$textarea.val($textarea.val() + (emoji.require_colons ? `:${emoji.name}:` : emoji.name));
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

function showScroller(isDefault) {
	const $wrap = $(EMOJI_PICKER_PATH).find('.scroller-wrap, .no-search-results');

	if (isDefault) {
		$wrap.filter('.tl-emoji-scroller-wrap').hide();
		$wrap.not('.tl-emoji-scroller-wrap').show();
	} else {
		$wrap.filter('.tl-emoji-scroller-wrap').show();
		$wrap.not('.tl-emoji-scroller-wrap').hide();
	}
}

function showOriginalScroller() {
	showScroller(true);
}

function showCustomScroller() {
	showScroller(false);
}

function replaceScroller() {
	const $loading = $(`
		<div class="scroller-wrap">
			<div class="scroller">
				<div class="be-emoji-loading-spinner"></div>
			</div>
		</div>
	`);
	 
	SCROLLER_WRAP_OLD = $(EMOJI_PICKER_PATH).find('.scroller-wrap').hide().before($loading);

	return buildScrollerWrap().then((wrap) => {
		SCROLLER_WRAP = wrap;
		SCROLLER_WRAP_OLD.before(SCROLLER_WRAP);
		$loading.remove();
	});
}

let searchIndex = null;

function replaceSearchInput() {
	SEARCH_INPUT = $(`
		<input type="text" placeholder="${TRANSLATION_MODULE.Messages.SEARCH_FOR_EMOJI}" value="">
	`);
	$(EMOJI_PICKER_PATH).find("input").hide().before(SEARCH_INPUT);
	
	const $searchScrollerWrap = $(`
		<div class="scroller-wrap">
			<div class="scroller"></div>
			<div class="sad-discord"></div>
			<div class="no-search-results-text">${TRANSLATION_MODULE.Messages.NO_EMOJI_SEARCH_RESULTS}</div>
		</div>
	`).hide();
	SCROLLER_WRAP.before($searchScrollerWrap);

	const $searchScroller = $searchScrollerWrap.find('.scroller');
	const $noResults = $searchScrollerWrap.find('.sad-discord, .no-search-results-text').hide();

	const cluster = new Clusterize({
		rows_in_block: 10,
		blocks_in_cluster: 3,
		scrollElem: $searchScroller[0],
		contentElem: $searchScroller[0],
	});

	SEARCH_INPUT.on('input', () => {
		const val = SEARCH_INPUT.val();
		if (!val) {
			$searchScrollerWrap.hide();
			SCROLLER_WRAP.show();
			return;
		}

		$searchScrollerWrap.show();
		SCROLLER_WRAP.hide();
		$searchScroller
			.html('<div class="be-emoji-loading-spinner"></div>')
			.show();

		filterEmojis(val, cluster)
		.then((rowCount) => {
			if (rowCount < 1) {
				$searchScroller.hide();
				$searchScrollerWrap.addClass('no-search-results');
				$noResults.show();
			} else {
				$searchScroller.show();
				$searchScrollerWrap.removeClass('no-search-results');
				$noResults.hide();
			}
		});
	});
}

function filterEmojis(query, cluster) {
	return new Promise((resolve, reject)=> {
		if (!searchIndex) {
			reject(new Error('searchIndex is not initialized'));
		}

		const result = searchIndex.search(query);
		const $rows = $('<span/>').append(buildEmojisRows(result)).children();
		const rows = $rows.toArray().map(e => e.outerHTML);

		if (rows[0] === '<div class="row"></div>') {
			resolve(0);
			return;
		}

		cluster.clear();
		cluster.update(rows);

		resolve(rows.length);
	});
}

function replaceCategories() {
	//Hide original categories
	const $picker = $(EMOJI_PICKER_PATH);
	const $oldCategories = $picker.find('.categories').hide();
	const $input = $picker.find('input');

	const $categoriesElement = $(`
		<div class="categories be-emoji-categories"></div>
	`);

	const categories = EMOJI_STORAGE_MODULE.getCategories();
	categories.unshift('custom');
	const scrollsTop = {};
	let fromTop = 0;

	function categoryItem(category) {
		return $(`<div class="item ${category}"></div>`)
			.click(function () {
				const $this = $(this);

				$categoriesElement.children().removeClass('selected');
				$this.addClass('selected');
				showCustomScroller();
				$input.val('');

				SCROLLER_WRAP.find('.scroller')
					.stop()
					.animate({ scrollTop: scrollsTop[category] }, 300, 'swing');
			});
	}

	for (const category of categories) {
		scrollsTop[category] = fromTop;
		fromTop += categoriesHeight[category];

		$categoriesElement.append(categoryItem(category));
	}

	$categoriesElement.find('.custom').addClass('selected');

	// Placeholder for future
	$categoriesElement.append($('<div class="item"></div>'));

	$oldCategories.before($categoriesElement);
}

function buildSearchIndex() {
	return new Promise((resolve, reject) => {
		const server = Server.getCurrentServer();
		const emojis = server.possibleEmojis();
		const search = new JsSearch.Search('id');

		search.addIndex('name');
		search.addDocuments(emojis);
		search.addDocuments(commonEmojis);

		resolve(search);
	});
}

function addCustomScrollerParts() {
	setTimeout(() => {
		setTimeout(showCustomScroller, 10);

		replaceScroller()
			.then(replaceSearchInput);

	}, 20);
}

function handleServerChange() {
	$('.guilds').on('click', '.guild', function () {
		buildSearchIndex().then((idx) => {
			searchIndex = idx;
		});
	});

	buildSearchIndex().then((idx) => {
		searchIndex = idx;
	});
}

exports.buildServerSpan = buildServerSpan;
exports.show = addCustomScrollerParts;
exports.handleServerChange = handleServerChange;

exports.setCommonEmojiSpanCache = function ({ spanCache, categoriesHeight: categoriesHeightArg, emojis }) {
	commonEmojisSpansCache = spanCache;
	categoriesHeight = categoriesHeightArg;
	commonEmojis = emojis;
};
