'use strict';

const Emoji = require('./emoji.js');

const GLOBAL_SERVER_LIST = [];

const id = Symbol('id');
const name = Symbol('name');
const emojis = Symbol('emojis');
const sharedEmojis = Symbol('sharedEmojis');
const permissions = Symbol('permissions');
const serverRegex = Symbol('serverRegex');

class Server {
	constructor(_id, _name, _permissions, _emojis = [], _sharedEmojis = []) {
		if (GLOBAL_SERVER_LIST.some(s => s.id === _id)) {
			throw new Error('Cannot have multiple servers with same id!');
		}

		this[id] = _id;
		this[name] = _name;
		this[permissions] = _permissions;
		this[emojis] = _emojis;
		this[sharedEmojis] = _sharedEmojis;
		this[serverRegex] = new RegExp(`.*/${_id.toString()}/\d+`);

		GLOBAL_SERVER_LIST.push(this);
	}

	addEmoji(emoji) {
		if (!(emoji instanceof Emoji)) {
			throw new TypeError('Only objects of class Emoji can be added using this method');
		}

		if (this[emojis].some(e => e.id === emoji.id)) {
			return;
		}

		this[emojis].push(emoji);

		if (emoji.isManaged) {
			this[sharedEmojis].push(emoji);
		}

		return this;
	}

	get canUseExternalEmojis() {
		return this[permissions] & 0x00040000;
	}

	get id() {
		return this[id];
	}

	get name() {
		return this[name];
	}

	get permissions() {
		return this[permissions];
	}

	get emojis() {
		return this[emojis];
	}

	get sharedEmojis() {
		return this[sharedEmojis];
	}

	isCurrent() {
		return this[serverRegex].test(window.location);
	}

	availableEmojis() {
		return this.isCurrent() ? this.emojis : this.sharedEmojis;
	}

	possibleEmojis() {
		const list = this.emojis;

		for (const server of GLOBAL_SERVER_LIST) {
			if (server.id === this.id) {
				continue;
			}

			list.push(...server.sharedEmojis);
		}

		return list;
	}

	static getCurrentServer() {
		return GLOBAL_SERVER_LIST.reduce((p, c) => (p || (c.isCurrent() && c)), false) || null;
	}

	static getAllServers() {
		return GLOBAL_SERVER_LIST;
	}

	static getById(id) {
		return GLOBAL_SERVER_LIST.reduce((p, c) => (p || ((c.id === id) && c)), false) || null;
	}
}

// Store "inbox" emulation of server
new Server('@me', '@me', 0x00040000); // eslint-disable-line no-new

module.exports = Server;
