'use strict';

const {
	SETTINGS_CLASSES,
	SIDEBAR_BUTTON_CLASS,
	SWITCH_CLASSES,
	FLEX_CHILD_CLASSES,
	FLEX_CLASSES,
	HEADER_CLASSES,
	SWITCH_ITEM_CLASSES,
	DIVIDER_ITEM_CLASSES,
	LABEL_ITEM_CLASSES,
	FONT_SIZE_CLASSES,
	CARD_CLASSES,
	SERVER_CARD_CLASSES,
} = require('./classes.js');

const { TRANSLATION_MODULE } = require('./constants.js');

const Settings = require('./settings.js');
const Server = require('./server.js');

function buildSidebarEntry() {
	const $entry = $('<span/>');

	const $button = $('<div/>')
		.addClass(SETTINGS_CLASSES.itemDefault)
		.addClass(SIDEBAR_BUTTON_CLASS)
		.html('Better Emojis');

	$button.mousedown(function () {
		const $this = $(this);

		// Make all selected items unselected
		changeClasses(SETTINGS_CLASSES.itemBrandSelected, SETTINGS_CLASSES.itemBrand);
		changeClasses(SETTINGS_CLASSES.itemDefaultSelected, SETTINGS_CLASSES.itemDefault);
		changeClasses(SETTINGS_CLASSES.itemDangerSelected, SETTINGS_CLASSES.itemDanger);

		// Make self selected
		$this.removeClass(SETTINGS_CLASSES.itemDefault).addClass(SETTINGS_CLASSES.itemDefaultSelected);
	});

	$entry.append($button).append($('<div/>').addClass(SETTINGS_CLASSES.separator));

	return { $entry, $button };
}

function changeClasses(from, to, parent = null) {
	const classes = `.${from.split(' ').join('.')}`;
	return (parent == null ? $(classes) : $(parent).find(classes)).removeClass(from).addClass(to);
}

function buildContentColumn() {
	const $column = $(`
	<div class="content-column default"><div>
		<div class="better-emojis-settings">
			<h2 class="${getClasses(HEADER_CLASSES, ['h2', 'defaultColor', 'defaultMarginh2'])}">
					Better Emojis
				</h2>
				<div class="flex-vertical">
					
				</div>
		</div>
	</div></div>
	`);

	const $contentDiv = $column.find('.flex-vertical');

	$contentDiv.append(checkbox({
		setting: 'enabled',
		name: 'Enabled',
		description: 'Enable or disable this plugin',
		value: Settings.get('enabled'),
		change: (value) => {
			Settings.set('enabled', value);
			updateHiddenServers();
		}
	}));

	const guildsIcons = getServersIcons();

	const $serverSortable = $('<div class="be-server-sortable"></div>');

	const servers = Server.getAllServers();

	for (const server of servers) {
		if (server.isGuild())
			$serverSortable.append(serverCard(server, guildsIcons));
	}

	const serversAccordion = UIkit.accordion($serverSortable, {
		duration: 150,
		targets: '> .be-accordion-item',
		toggle: '> .be-accordion-title',
		content: '> .be-accordion-data',
	});

	UIkit.sortable($serverSortable, {
		animation: 150,
		'cls-item': SERVER_CARD_CLASSES.serverCard,
	});

	$serverSortable.on('start', function (event, sortable, target, dragged) {
		// console.log(arguments);
		if (target.hasClass('uk-open')) {
			serversAccordion.toggle(target, false);
			dragged.css({ height: target.outerHeight() });
		}
	});

	$serverSortable.on('beforeshow', function (event, accordion) {
		$(event.target).closest('.be-accordion-item').trigger('accordion.open');
	});

	$serverSortable.on('hidden', function (event, accordion) {
		$(event.target).closest('.be-accordion-item').trigger('accordion.close');
	});

	$serverSortable.on('change', function (event, sortable, target) {
		const $children = sortable.$el.children();
		const out = [];
		out.length = $children.length;

		for (let i = 0; i < $children.length; i++) {
			out[i] = $($children[i]).data('server-id');
		}

		Settings.set('picker.serversorder', out);
	});

	$contentDiv.append($serverSortable);

	return $column;
}

const SERVER_REGEX = /\/channels\/(\d+)\/\d+/;
const BACKGOUND_URL_REGEX = /background-image: url\("(.*)"\);/;

function getServersIcons() {
	const guildsIcons = {};

	$('.guild').map((i, guild) => {
		const $avatar = $(guild).find('.avatar-small');
		const match = SERVER_REGEX.exec($avatar.attr('href'));

		if (!match) {
			return guild;
		}

		guildsIcons[`${match[1]}`] = BACKGOUND_URL_REGEX.exec($avatar.attr('style'))[1];
		return guild;
	});

	return guildsIcons;
}

function injectPanel(layer) {
	const $layer = $(layer);

	const { $entry, $button } = buildSidebarEntry();
	const $contentColumn = buildContentColumn().hide();
	const $contentRegion = $layer.find('.content-region-scroller');

	$contentRegion.prepend($contentColumn);

	$layer.find('.sidebar > div')
		.children()
		.mousedown(() => {
			$contentRegion.find('.content-column').show();
			$contentColumn.hide();
			$button.removeClass(SETTINGS_CLASSES.itemDefaultSelected).addClass(SETTINGS_CLASSES.itemDefault);
		})
		.filter((index, element) => $(element).text() === TRANSLATION_MODULE.Messages.CHANGE_LOG)
		.before($entry);

	$button.mousedown(() => {
		$contentRegion.find('.content-column').hide();
		$contentColumn.show();
	});
}

function getClasses(from, what) {
	if (!(what instanceof Array))
		return from[what];

	const res = [];

	for (const key of what) {
		if (typeof from[key] === 'undefined') {
			console.warn(from, `doesn't have property ${key}. Check module numbers`);
		}

		res.push(from[key]);
	}

	return res.join(' ');
}

function checkbox({ setting, name, description, value, change }) {
	//jscs:disable maximumLineLength
	return $(`
		<div class="${[FLEX_CHILD_CLASSES.flex, getClasses(FLEX_CLASSES, ['vertical', 'justifyStart', 'alignStretch', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
			<div class="${[getClasses(FLEX_CHILD_CLASSES, ['flex', 'horizontal']), getClasses(FLEX_CLASSES, ['justifyStart', 'alignStart', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
				<h3 class="${[getClasses(HEADER_CLASSES, ['h3', 'defaultColor']),  SWITCH_ITEM_CLASSES.title, FLEX_CHILD_CLASSES.flexChild].join(' ')}" style="flex: 1 1 auto;">
					${name}
				</h3>
				<div class="${SWITCH_CLASSES.switchWrapperDefaultActive} ${FLEX_CHILD_CLASSES.flexChild}" style="flex: 0 0 auto;">
					<input type="checkbox" class="${SWITCH_CLASSES.checkbox}" value="on">
					<div class="${SWITCH_CLASSES.switch} ${value ? SWITCH_CLASSES.checked : ''}"></div>
				</div>
			</div>
			<div class="${[LABEL_ITEM_CLASSES.description, SWITCH_ITEM_CLASSES.note, LABEL_ITEM_CLASSES.modeDefault, FONT_SIZE_CLASSES.primary].join(' ')}" style="flex: 1 1 auto; ${description ? '' : 'display: none;'}">
				${description}
			</div>
			<div class="${DIVIDER_ITEM_CLASSES.divider} ${SWITCH_ITEM_CLASSES.divider}"></div>
		</div>
		`)

		//jscs:enable maximumLineLength
		.on('click', function () {
			const $this = $(this).find(`.${SWITCH_CLASSES.switch}`);

			$this.toggleClass(SWITCH_CLASSES.checked);

			if (typeof change === 'function') {
				change($this.hasClass(SWITCH_CLASSES.checked));
			}
		});
}

function serverCard(server, iconStorage) {
	//jscs:disable maximumLineLength
	const $card = $(`
		<div class="be-accordion-item ${CARD_CLASSES.cardPrimary} ${SERVER_CARD_CLASSES.serverCard}" id="server-card-${server.id}" style="padding: 7px">
			<div class="be-accordion-title ${getClasses(FLEX_CLASSES, ['horizontal', 'flex', 'justifyStart', 'alignStretch', 'noWrap'])}">
				<div class="${FLEX_CHILD_CLASSES.flexChild}" style="padding-right: 15px;">
					<img class="${SERVER_CARD_CLASSES.icon}" src="${iconStorage[server.id]}"/>
				</div>
				<div class="${FLEX_CHILD_CLASSES.flexChild} ${FLEX_CLASSES.vertical}" style="width: 60%">
					<h5 class="${FLEX_CHILD_CLASSES.flexChild} ${HEADER_CLASSES.h5} margin-bottom-4">${server.name}</h5>
					<h5 class="${FLEX_CHILD_CLASSES.flexChild} ${HEADER_CLASSES.h5} margin-bottom-4">Emojis: ${server.emojis.length}, BBTV: ${server.sharedEmojis.length}</h5>	
				</div>
				<div class="${FLEX_CHILD_CLASSES.flexChild} ${FLEX_CLASSES.vertical}" style="flex: 1 1 auto;">
					<div class="margin-bottom-4 ${[SERVER_CARD_CLASSES.showInPicker, getClasses(FLEX_CHILD_CLASSES, ['flex', 'horizontal']), getClasses(FLEX_CLASSES, ['justifyStart', 'alignStart', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
						<h3 class="${[getClasses(HEADER_CLASSES, ['h3', 'defaultColor']),  SWITCH_ITEM_CLASSES.title, FLEX_CHILD_CLASSES.flexChild].join(' ')}" style="flex: 1 1 auto;">
							Picker
						</h3>
						<div class="${SWITCH_CLASSES.switchWrapperDefaultActive} ${FLEX_CHILD_CLASSES.flexChild}" style="flex: 0 0 auto;">
							<input type="checkbox" class="${SWITCH_CLASSES.checkbox}" value="on">
							<div class="${SWITCH_CLASSES.switch} ${server.isShownInPicker() ? SWITCH_CLASSES.checked : ''} ${SERVER_CARD_CLASSES.showInPickerSwitch}"></div>
						</div>
					</div>
					<div class="margin-bottom-4 ${[SERVER_CARD_CLASSES.showInServerList, getClasses(FLEX_CHILD_CLASSES, ['flex', 'horizontal']), getClasses(FLEX_CLASSES, ['justifyStart', 'alignStart', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
						<h3 class="${[getClasses(HEADER_CLASSES, ['h3', 'defaultColor']),  SWITCH_ITEM_CLASSES.title, FLEX_CHILD_CLASSES.flexChild].join(' ')}" style="flex: 1 1 auto;">
							Server list
						</h3>
						<div class="${SWITCH_CLASSES.switchWrapperDefaultActive} ${FLEX_CHILD_CLASSES.flexChild}" style="flex: 0 0 auto;">
							<input type="checkbox" class="${SWITCH_CLASSES.checkbox}" value="on">
							<div class="${SWITCH_CLASSES.switch} ${server.isShownInList() ? SWITCH_CLASSES.checked : ''} ${SERVER_CARD_CLASSES.showInServerListSwitch}"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="be-accordion-data">
				<div class="${DIVIDER_ITEM_CLASSES.divider}" style="margin-top: 4px; margin-bottom: 7px;"></div>
				<div class="container">
					<div style="flex: 1;">
						<h3 class="container-title ${getClasses(HEADER_CLASSES, ['h3', 'defaultColor'])}">
							Enabled Emojis
						</h3>
						<div class="${CARD_CLASSES.cardPrimary} be-emoji-container enabled-emoji-container"></div>
					</div>
					<div style="flex: 1; padding-left:5px">
						<h3 class="container-title ${getClasses(HEADER_CLASSES, ['h3', 'defaultColor'])}">
							Disabled Emojis
						</h3>
						<div class="${CARD_CLASSES.cardPrimary} be-emoji-container disabled-emoji-container"></div>
					</div>
				</div>
			</div>
		</div>
	`);

	const $enabledEmojis = $card.find('.enabled-emoji-container');
	const $disabledEmojis = $card.find('.disabled-emoji-container');
	const $accordionContent = $card.find('.be-accordion-data');

	function emojiItem(emoji) {
		return $('<div class="be-emoji-item"></div>')
			.css('background-image', `url("${emoji.url}")`)
			.data('emoji-id', `${emoji.id}`);
	}

	function handleChange() {
		$enabledEmojis
			.children()
			.map((i, c) => Settings.set(`picker.emoji.enabled.${$(c).data('emoji-id')}`, true));
		$disabledEmojis
			.children()
			.map((i, c) => Settings.set(`picker.emoji.enabled.${$(c).data('emoji-id')}`, false));
	}

	let enabledEmojisSortable;
	let disabledEmojisSortable;

	$enabledEmojis.on('change', handleChange);
	$disabledEmojis.on('change', handleChange);

	$card.data('server-id', server.id);

	$card.on('accordion.close', () => {
		handleChange();
		$enabledEmojis.html('');
		$disabledEmojis.html('');
		enabledEmojisSortable.$destroy();
		disabledEmojisSortable.$destroy();
	});

	$card.on('accordion.open', () => {
		for (const emoji of server.emojis) {
			if (Settings.get(`picker.emoji.enabled.${emoji.id}`, true)) {
				$enabledEmojis.append(emojiItem(emoji));
			} else {
				$disabledEmojis.append(emojiItem(emoji));
			}
		}

		//FIXME sortable shaking while movening element
		enabledEmojisSortable = UIkit.sortable($enabledEmojis, {
			group: `emoji-sortable-${server.id}`,
			animation: 150,
			'cls-base': 'be-emoji-container',
			'cls-item': 'be-emoji-item',
			'cls-empty': 'be-empty-sortable',
		});

		disabledEmojisSortable = UIkit.sortable($disabledEmojis, {
			group: `emoji-sortable-${server.id}`,
			animation: 150,
			'cls-base': 'be-emoji-container',
			'cls-item': 'be-emoji-item',
			'cls-empty': 'be-empty-sortable',
		});
	});

	//jscs:enable maximumLineLength
	$card.find(`.${SERVER_CARD_CLASSES.showInServerList}`).click(function (e) {
		e.stopPropagation();

		const $switch = $(this).find(`.${SERVER_CARD_CLASSES.showInServerListSwitch}`);
		$switch.toggleClass(SWITCH_CLASSES.checked);

		const isShown = $switch.hasClass(SWITCH_CLASSES.checked);

		Settings.set(`serverlist.show.${server.id}`, isShown);

		updateHiddenServers();
	});

	$card.find(`.${SERVER_CARD_CLASSES.showInPicker}`).click(function (e) {
		e.stopPropagation();

		const $switch = $(this).find(`.${SERVER_CARD_CLASSES.showInPickerSwitch}`);
		$switch.toggleClass(SWITCH_CLASSES.checked);

		Settings.set(`picker.server.show.${server.id}`, $switch.hasClass(SWITCH_CLASSES.checked));
	});

	return $card;
}

function updateHiddenServers() {
	$('.guild').map((i, guild) => {
		const $avatar = $(guild).find('.avatar-small');
		const match = SERVER_REGEX.exec($avatar.attr('href'));

		if (!match) {
			return guild;
		}

		const server = Server.getById(match[1]);

		if (server.isShownInList() || !Settings.get('enabled', true)) {
			$(guild).removeAttr('style');
		} else {
			$(guild).animate({ width: 0, height: 0 }, 500, 'swing', function () {
				$(this).hide();
			});
		}

		return guild;
	});
}

exports.updateHiddenServers = updateHiddenServers;

exports.inject = injectPanel;
