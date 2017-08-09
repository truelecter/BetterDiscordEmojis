'use strict';

const $ = require('jquery');

const { getClasses } = require('./helpers.js');

const {
	SWITCH_CLASSES,
	FLEX_CHILD_CLASSES,
	FLEX_CLASSES,
	HEADER_CLASSES,
	SWITCH_ITEM_CLASSES,
	DIVIDER_ITEM_CLASSES,
	LABEL_ITEM_CLASSES,
	FONT_SIZE_CLASSES,
} = require('./classes.js');

function checkbox({ setting, name, description, value, change }) {
	//jscs:disable maximumLineLength
	return $(`
		<div class="${[FLEX_CHILD_CLASSES.flex, getClasses(FLEX_CLASSES, ['vertical', 'justifyStart', 'alignStretch', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
			<div class="${[getClasses(FLEX_CHILD_CLASSES, ['flex', 'horizontal']), getClasses(FLEX_CLASSES, ['justifyStart', 'alignStart', 'noWrap'])].join(' ')}" style="flex: 1 1 auto;">
				<h3 class="${[getClasses(HEADER_CLASSES, ['h3', 'defaultColor']),  SWITCH_ITEM_CLASSES.titleDefault, FLEX_CHILD_CLASSES.flexChild].join(' ')}" style="flex: 1 1 auto;">
					${name}
				</h3>
				<div class="${getClasses(SWITCH_CLASSES, ['switchEnabled', 'sizeDefault', 'themeDefault'])} ${value ? SWITCH_CLASSES.valueChecked : SWITCH_CLASSES.valueUnchecked} ${FLEX_CHILD_CLASSES.flexChild}" style="flex: 0 0 auto;">
					<input type="checkbox" class="${SWITCH_CLASSES.checkboxEnabled}" value="on">
				</div>
			</div>
			<div class="${[LABEL_ITEM_CLASSES.description, SWITCH_ITEM_CLASSES.note, LABEL_ITEM_CLASSES.modeDefault, FONT_SIZE_CLASSES.primary].join(' ')}" style="flex: 1 1 auto; ${description ? '' : 'display: none;'}">
				${description}
			</div>
			<div class="${DIVIDER_ITEM_CLASSES.divider} ${SWITCH_ITEM_CLASSES.dividerMini}"></div>
		</div>
		`) //jscs:enable maximumLineLength
		.on('click', function () {
			const $this = $(this).find(`.${SWITCH_CLASSES.switch}`);

			if ($this.hasClass(SWITCH_CLASSES.valueChecked)) {
				$this.removeClass(SWITCH_CLASSES.valueChecked).addClass(SWITCH_CLASSES.valueUnchecked);
			} else {
				$this.removeClass(SWITCH_CLASSES.valueUnchecked).addClass(SWITCH_CLASSES.valueChecked);
			}

			if (typeof change === 'function') {
				change($this.hasClass(SWITCH_CLASSES.valueChecked));
			}
		});
}

module.exports = checkbox;
