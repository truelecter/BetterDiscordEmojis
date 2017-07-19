'use strict';

const observer = Symbol('observer');
const addListeners = Symbol('addListeners');
const removeListeners = Symbol('removeListeners');

class ChildAddRemoveObserver {
	constructor(target = null, addListener = null, removeListener = null) {
		this[observer] = new MutationObserver(([mutation]) => {
			if (mutation.type !== 'childList') {
				return;
			}

			if (mutation.addedNodes.length > 0) {
				for (const listener of this[addListeners]) {
					listener(mutation);
				}
			}

			if (mutation.removedNodes.length > 0) {
				for (const listener of this[removeListeners]) {
					listener(mutation);
				}
			}
		});

		this[addListeners] = [];
		this[removeListeners] = [];

		if (target) {
			this.observe(target);
		}

		this.add(addListener).remove(removeListener);
	}

	observe(target) {
		if (!target || !(target instanceof Node)) {
			throw new TypeError('Target must be Node!');
		}

		this[observer].observe(target, {
			childList: true
		});

		return this;
	}

	add(listener) {
		return this.on('add', listener);
	}

	remove(listener) {
		return this.on('remove', listener);
	}

	on(evt, listener) {
		if (typeof listener === 'function') {
			throw new TypeError('Listener must be function');
		}

		switch (evt) {
			case 'add':
				this[addListeners].push(listener);

				break;
			case 'remove':
				this[removeListeners].push(listener);

				break;
		}

		return this;
	}

	off(evt) {
		switch (evt) {
			case 'add':
				this[addListeners] = [];

				break;
			case 'remove':
				this[removeListeners] = [];

				break;
		}

		return this;
	}

	disconnect() {
		this[observer].disconnect();

		return this;
	}
}

module.exports.ChildAddRemoveObserver = ChildAddRemoveObserver;
