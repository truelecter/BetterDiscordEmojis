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
} = require('./classes.js');

const { TRANSLATION_MODULE } = require('./constants.js');

const Settings = require('./settings.js');

function buildSidebarEntry() {
	const $entry = $('<span/>');

	const $button = $('<div/>').addClass(SETTINGS_CLASSES.itemDefault).addClass(SIDEBAR_BUTTON_CLASS).html('Better Emojis');

	$button.click(function () {
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
			<h2 class="h2-2ar_1B title-1pmpPr size16-3IvaX_ height20-165WbF weightSemiBold-T8sxWH defaultColor-v22dK1 defaultMarginh2-37e5HZ marginBottom20-2Ifj-2">
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
		}
	}));

	return $column;
}

function injectPanel(layer) {
	const $layer = $(layer);

	const { $entry, $button } = buildSidebarEntry();
	const $contentColumn = buildContentColumn().hide();
	const $contentRegion = $layer.find('.content-region-scroller');
	
	$contentRegion.prepend($contentColumn);

	$layer.find('.sidebar > div')
		.children()
		.click(() => {
			$contentRegion.find('.content-column').show();
			$contentColumn.hide();
			$button.removeClass(SETTINGS_CLASSES.itemDefault).addClass(SETTINGS_CLASSES.itemDefaultSelected);
		})
		.filter((index, element) => { return $(element).text() === TRANSLATION_MODULE.Messages.CHANGE_LOG; }).before($entry);

	
	$button.click(() => {
		$contentRegion.find('.content-column').hide();
		$contentColumn.show();
	})
}

function getClasses(from, what) {
	if (!(what instanceof Array)) 
		return from[what];
	
	const res = [];

	for (const key of what) {
		if (typeof what === 'undefined') {
			console.warn(from, `doesn't have property ${what}. Check module numbers`)
		}
		res.push(from[key]);
	}

	return res.join(' ');
}

function checkbox({ setting, name, description, value, change }) {
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
		`).on('click', function() {
			const $this = $(this).find(`.${SWITCH_CLASSES.switch}`);
			
			$this.toggleClass(SWITCH_CLASSES.checked);

			if (typeof change === 'function') {
				change($this.hasClass(SWITCH_CLASSES.checked));
			}
		});
}

exports.inject = injectPanel;