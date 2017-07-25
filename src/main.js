'use strict';

const Picker = require('./picker.js');
const SettingsPanel = require('./settings-panel.js');
const Settings = require('./settings.js');
const Observer = require('./observer.js').ChildAddRemoveObserver;
const {
	EMOJI_PICKER_PATH,
	EMOJI_BUTTON_CLASS,
} = require('./constants.js');

const initEmojis = require('./initializer.js');

function attachPickerObserver() {
	if (window.better_emojis.pickerObserver) {
		window.better_emojis.pickerObserver.disconnect();
	} else {
		window.better_emojis.pickerObserver = new Observer(null,
			() => {
				if (!Settings.get('enabled')) {
					return;
				}

				let isPickerOpened = !!$(EMOJI_PICKER_PATH).find('.emoji-picker').length;
				let isInlineOrTextareaPicker =
					$(`.${EMOJI_BUTTON_CLASS}`).hasClass('popout-open') ||
					!!$('.btn-reaction.popout-open').length;
				if (isPickerOpened && isInlineOrTextareaPicker) {
					Picker.show();
				}
			},

			() => {
				if (window.better_emojis.current_cluster) {
					window.better_emojis.current_cluster.destroy();
				}
			}
		);
	}

	window.better_emojis.pickerObserver.reattach = attachPickerObserver;
	window.better_emojis.pickerObserver.observe($(EMOJI_PICKER_PATH)[0]);
}

function attachSettingsObserver() {
	if (window.better_emojis.settingsObserver) {
		window.better_emojis.settingsObserver.disconnect();
	} else {
		window.better_emojis.settingsObserver = new Observer(null,
			(mutation) => {
				setTimeout(() => {
					SettingsPanel.inject(mutation.addedNodes[0]);
				}, 30);
			}
		);
	}

	window.better_emojis.settingsObserver.reattach = attachPickerObserver;
	window.better_emojis.settingsObserver.observe($('.layers')[0]);
}

initEmojis().then((spanCache) => {
	Picker.setCommonEmojiSpanCache(spanCache.spanCache);
	setTimeout(() => {
		attachPickerObserver();
		attachSettingsObserver();
		console.log('Better Emojis initialized');
	}, 2000);
});
