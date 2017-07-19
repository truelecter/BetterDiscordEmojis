'use strict';

const Constants = require('./constants.js');
const Picker = require('./picker.js');
const Observer = require('./observer.js').ChildAddRemoveObserver;

const initEmojis = require('./initializer.js');

function attachPickerObserver() {
	if (window.better_emojis.pickerObserver) {
		window.better_emojis.pickerObserver.disconnect();
	} else {
		window.better_emojis.pickerObserver = new Observer(null,
			() => {
				if ($(Constants.EMOJI_PICKER_PATH).find('.emoji-picker').length &&
					($('.channel-textarea-emoji').hasClass('popout-open') || $('.btn-reaction.popout-open').length)) {
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
	window.better_emojis.pickerObserver.observe($(Constants.EMOJI_PICKER_PATH)[0]);
}

initEmojis().then((spanCache) => {
	Picker.setCommonEmojiSpanCache(spanCache.spanCache);
	setTimeout(() => {
		attachPickerObserver();
		console.log('Better Emojis initialized');
	}, 2000);
});
