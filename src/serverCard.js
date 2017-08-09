'use strict';

const $ = require('jquery');
const UIkit = require('uikit');

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
						<h3 class="${[getClasses(HEADER_CLASSES, ['h3', 'defaultColor']),  SWITCH_ITEM_CLASSES.titleMini, FLEX_CHILD_CLASSES.flexChild].join(' ')}" style="flex: 1 1 auto;">
							Picker
						</h3>
						<div class="${getClasses(SWITCH_CLASSES, ['switchEnabled', 'sizeMini', 'themeDefault'])} ${server.isShownInPicker() ? SWITCH_CLASSES.valueChecked : SWITCH_CLASSES.valueUnchecked} ${FLEX_CHILD_CLASSES.flexChild} ${SERVER_CARD_CLASSES.showInPickerSwitch}" style="flex: 0 0 auto;">
							<input type="checkbox" class="${SWITCH_CLASSES.checkboxEnabled}" value="on">
						</div>
					</div>
					<div class="margin-bottom-4 ${[SERVER_CARD_CLASSES.showInServerList, getClasses(FLEX_CHILD_CLASSES, ['flex', 'horizontal']), getClasses(FLEX_CLASSES, ['justifyStart', 'alignStart', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
						<h3 class="${[getClasses(HEADER_CLASSES, ['h3', 'defaultColor']),  SWITCH_ITEM_CLASSES.titleMini, FLEX_CHILD_CLASSES.flexChild].join(' ')}" style="flex: 1 1 auto;">
							Server list
						</h3>
						<div class="${getClasses(SWITCH_CLASSES, ['switchEnabled', 'sizeMini', 'themeDefault'])} ${SERVER_CARD_CLASSES.showInServerListSwitch} ${server.isShownInList() ? SWITCH_CLASSES.valueChecked : SWITCH_CLASSES.valueUnchecked} ${FLEX_CHILD_CLASSES.flexChild}" style="flex: 0 0 auto;">
							<input type="checkbox" class="${SWITCH_CLASSES.checkboxEnabled}" value="on">
						</div>
					</div>
				</div>
			</div>
			<div class="be-accordion-data">
				<div class="${DIVIDER_ITEM_CLASSES.divider}" style="margin-top: 4px; margin-bottom: 7px;"></div>
				<div class="container">
					<div class="be-emoji-container-wrapper">
						<h3 class="container-title ${getClasses(HEADER_CLASSES, ['h3', 'defaultColor'])}">
							Enabled Emojis
						</h3>
						<div class="${CARD_CLASSES.cardPrimary} be-emoji-container enabled-emoji-container"></div>
					</div>
					<div class="be-emoji-container-wrapper" style="padding-left:5px">
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
	const $showModeButton = $('#be-emoji-show-mode');

	function emojiItem(emoji) {
		return $(`<div class="be-emoji-item 
				${emoji.isManaged ? 'be-emoji-item-bbtv' :
					$showModeButton.hasClass('be-button-enabled') ?
						'be-emoji-item-deafult be-emoji-faded' :
						'be-emoji-item-deafult'
				}"></div>`)
			.css('background-image', `url("${emoji.url}")`)
			.data('emoji-id', `${emoji.id}`)
			.attr('title', `${emoji.useName}`)
			.dblclick(function () {
				const $this = $(this).detach();

				if (Settings.get(`picker.emoji.enabled.${emoji.id}`, true)) {
					$disabledEmojis.append($this);
				} else {
					$enabledEmojis.append($this);
				}

				handleChange();
			});
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
	let emojiTooltip;

	$enabledEmojis.on('change', handleChange);
	$disabledEmojis.on('change', handleChange);

	$card.data('server-id', server.id);

	$card.on('accordion.close', () => {
		handleChange();
		$enabledEmojis.html('');
		$disabledEmojis.html('');
		enabledEmojisSortable.$destroy();
		disabledEmojisSortable.$destroy();
		emojiTooltip.$destroy();
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

		emojiTooltip = UIkit.tooltip($accordionContent.find('.be-emoji-item'));
	});

	$card.find(`.${SERVER_CARD_CLASSES.showInServerList}`).click(function (e) {
		e.stopPropagation();

		const $switch = $(this).find(`.${SERVER_CARD_CLASSES.showInServerListSwitch}`);
		if ($switch.hasClass(SWITCH_CLASSES.valueChecked)) {
			$switch.removeClass(SWITCH_CLASSES.valueChecked).addClass(SWITCH_CLASSES.valueUnchecked);
		} else {
			$switch.removeClass(SWITCH_CLASSES.valueUnchecked).addClass(SWITCH_CLASSES.valueChecked);
		}

		const isShown = $switch.hasClass(SWITCH_CLASSES.valueChecked);

		Settings.set(`serverlist.show.${server.id}`, isShown);

		onServerChangeState && onServerChangeState(server, isShown);
	});

	$card.find(`.${SERVER_CARD_CLASSES.showInPicker}`).click(function (e) {
		e.stopPropagation();

		const $switch = $(this).find(`.${SERVER_CARD_CLASSES.showInPickerSwitch}`);
		if ($switch.hasClass(SWITCH_CLASSES.valueChecked)) {
			$switch.removeClass(SWITCH_CLASSES.valueChecked).addClass(SWITCH_CLASSES.valueUnchecked);
		} else {
			$switch.removeClass(SWITCH_CLASSES.valueUnchecked).addClass(SWITCH_CLASSES.valueChecked);
		}

		Settings.set(`picker.server.show.${server.id}`, $switch.hasClass(SWITCH_CLASSES.valueChecked));
	});

	return $card;
}

module.exports = serverCard;
