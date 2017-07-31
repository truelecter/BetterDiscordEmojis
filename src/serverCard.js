'use strict';

const { getClasses } = require('./helpers.js');

const {
	SWITCH_CLASSES,
	FLEX_CHILD_CLASSES,
	FLEX_CLASSES,
	HEADER_CLASSES,
	SWITCH_ITEM_CLASSES,
	DIVIDER_ITEM_CLASSES,
	CARD_CLASSES,
	SERVER_CARD_CLASSES,
} = require('./classes.js');

const Settings = require('./settings.js');

function serverCard(server, iconStorage, onServerChangeState) {
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
	`); //jscs:enable maximumLineLength

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

	$card.find(`.${SERVER_CARD_CLASSES.showInServerList}`).click(function (e) {
		e.stopPropagation();

		const $switch = $(this).find(`.${SERVER_CARD_CLASSES.showInServerListSwitch}`);
		$switch.toggleClass(SWITCH_CLASSES.checked);

		const isShown = $switch.hasClass(SWITCH_CLASSES.checked);

		Settings.set(`serverlist.show.${server.id}`, isShown);

		onServerChangeState && onServerChangeState(server, isShown);
	});

	$card.find(`.${SERVER_CARD_CLASSES.showInPicker}`).click(function (e) {
		e.stopPropagation();

		const $switch = $(this).find(`.${SERVER_CARD_CLASSES.showInPickerSwitch}`);
		$switch.toggleClass(SWITCH_CLASSES.checked);

		Settings.set(`picker.server.show.${server.id}`, $switch.hasClass(SWITCH_CLASSES.checked));
	});

	return $card;
}

module.exports = serverCard;
