(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
'use strict';

exports.SETTINGS_CLASSES = n(2392);
exports.SWITCH_CLASSES = n(2390);
exports.FLEX_CHILD_CLASSES = n(2374);
exports.FLEX_CLASSES = n(2355);
exports.HEADER_CLASSES = n(2401);
exports.SWITCH_ITEM_CLASSES = n(2391);
exports.DIVIDER_ITEM_CLASSES = n(2397);
exports.LABEL_ITEM_CLASSES = n(2400);
exports.FONT_SIZE_CLASSES = n(2393);
exports.CARD_CLASSES = n(2366);

exports.SIDEBAR_BUTTON_CLASS = 'be-settings-button';
exports.SERVER_CARD_CLASSES = {
	showInPicker: 'be-server-show-in-picker',
	showInPickerSwitch: 'be-server-show-in-picker-switch',
	showInServerList: 'be-server-show-in-server-list',
	showInServerListSwitch: 'be-server-show-in-server-list-switch',
	serverCard: 'be-server-card',
	icon: 'be-server-icon',
};

function n(id) {
	return webpackJsonp([], [], [id]);
}

},{}],5:[function(require,module,exports){
'use strict';

//jscs: disable maximumLineLength
exports.API_BASE = 'https://discordapp.com/api';

/* May be changed with discord updates */
exports.EMOJI_PICKER_PATH = '#app-mount > div > div:nth-child(7)';
exports.EMOJI_BUTTON_CLASS = n(2367).emojiButton;
exports.CHANNEL_TEXTAREA_CLASS = n(2367).channelTextArea;
exports.LOCAL_STORAGE_MODULE = n(1786);
exports.EMOJI_STORAGE_MODULE = n(174).default;
exports.TRANSLATION_MODULE = n(3);
exports.CUSTOM_EMOJI_STORAGE_MODULE = n(204);
exports.TOKEN_KEY = n(0).TOKEN_KEY;
/* May be changed with discord updates.END */

exports.ELEMENT_SCROLLER_WRAP = '<div class="scroller-wrap tl-emoji-scroller-wrap"><div class="scroller"></div></div>';

exports.ELEMENT_SEARCH_INPUT = '<input type="text" placeholder="Find the perfect emoji" value="">';

exports.ELEMENT_SERVER_EMOJI_LIST = '<span class="server-emojis"><div class="category">server.name</div></span>';
exports.ELEMENT_SERVER_EMOJI_LIST_ROW = '<div class="row"></div>';
exports.ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY = '<div class="emoji-item"></div>'; // max 10 per row

exports.REACTION_POPOUT_REGEX = /TOGGLE_REACTION_POPOUT_(\d+)/;
exports.CURRENT_SELECTED_CHANNEL_REGEX = /.*\/.+\/(\d+)/;
exports.IS_INBOX_REGEX = /\/channels\/@me\/\d+/;

exports.IS_NUMBER_REGEX = /\d+/;

exports.BETTER_EMOJIS_KEY = 'better-emojis';

/**
 * Default options HTTP Fetch jQuery
 *
 * @type {Object}
 */
exports.defaultFetchOptions = {
	method: 'GET'
};

function n(id) {
	return webpackJsonp([], [], [id]);
}

},{}],6:[function(require,module,exports){
'use strict';

const id = Symbol('id');
const name = Symbol('name');
const url = Symbol('url');
const managed = Symbol('managed');
const requireColons = Symbol('requireColons');
const roles = Symbol('roles');

const GLOBAL_EMOJI_MAP = new Map;

class Emoji {
	constructor(
		_id,
		_name,
		_managed = false,
		_requireColons = true,
		_roles = [],
		_url = `https://cdn.discordapp.com/emojis/${_id}.png`
	) {
		this[id] = _id;
		this[name] = _name;
		this[url] = _url;
		this[managed] = _managed;
		this[requireColons] = _requireColons;
		this[roles] = _roles;

		GLOBAL_EMOJI_MAP.set(this[id], this);
	}

	get id() {
		return this[id];
	}

	get name() {
		return this[name];
	}

	get url() {
		return this[url];
	}

	get isManaged() {
		return this[managed];
	}

	get colonsRequired() {
		return this[requireColons];
	}

	get roles() {
		return this[roles];
	}

	get useName() {
		return this.colonsRequired ? `:${this.name}:` : this.name;
	}

	static fromRaw(emojiRaw) {
		return new Emoji(
			emojiRaw.id,
			emojiRaw.name,
			emojiRaw.managed,
			emojiRaw.requireColons,
			emojiRaw.roles
		);
	}

	static getById(id) {
		return GLOBAL_EMOJI_MAP.get(id);
	}
}

module.exports = Emoji;

},{}],7:[function(require,module,exports){
'use strict';

const { defaultFetchOptions } = require('./constants');

/**
 * Fetch URL
 *
 * @param {Object} options
 *
 * @return {Promise<mixed>}
 */
exports.fetchURL = function fetchURL(options) {
	return new Promise((resolve, reject) => {
		options = Object.assign({}, defaultFetchOptions, options);

		$.ajax(options).then(resolve).fail(reject);
	});
};

},{"./constants":5}],8:[function(require,module,exports){
'use strict';

const Server = require('./server.js');
const Emoji = require('./emoji.js');
const Picker = require('./picker.js');
const { fetchURL } = require('./helpers.js');
const {
	API_BASE,
	TOKEN_KEY,
	TRANSLATION_MODULE,
	EMOJI_STORAGE_MODULE,
	LOCAL_STORAGE_MODULE,
	CUSTOM_EMOJI_STORAGE_MODULE,
} = require('./constants.js');

let MY_ID = '';

function getServers() {
	return fetchURL({
		url: `${API_BASE}/users/@me/guilds`,
		dataType: 'json'
	});
}

function getMyId() {
	return fetchURL({
		url: `${API_BASE}/users/@me`,
		dataType: 'json'
	})
	.then((response) => {
		MY_ID = response.id;

		return response;
	});
}

function parseServer({ id: serverId, permissions: serverPermissions }) {
	return fetchURL({
		url: `${API_BASE}/guilds/${serverId}/members/${MY_ID}`,
		dataType: 'json'
	})
	.then(({ roles }) => (
		fetchURL({
			url: `${API_BASE}/guilds/${serverId}`,
			dataType: 'json'
		})
		.then(({ id, name, emojis }) => ({
			id,
			name,
			roles,
			emojis
		}))
	))
	.then(({ id, name, emojis, roles }) => {
		// now we got detailed info about server. fill emoji and managed emojis.
		// also set name
		const server = new Server(id, name, serverPermissions);
		const emojiContext = CUSTOM_EMOJI_STORAGE_MODULE.getDisambiguatedEmojiContext(id);

		// Eventually, CUSTOM_EMOJI_STORAGE_MODULE filters emojis that we can't use by itself!
		return emojis
			.map(e => emojiContext.getById(e.id))
			.filter(e => !!e)
			.map(Emoji.fromRaw)
			.reduce(function (server, emoji) {
				server.addEmoji(emoji);
				return server;
			}, server);
	});
}

function parseServers(serversA) {
	return Promise.all(serversA.map(parseServer));
}

function loadStandartEmojis() {
	let commonEmojis = [];

	const translation = TRANSLATION_MODULE.Messages;
	const categories = EMOJI_STORAGE_MODULE.getCategories();
	let $commonEmojisSpansCacheSpan = $('<span></span>');

	for (let category of categories) {
		const tr = translation[`EMOJI_CATEGORY_${category.toUpperCase()}`];
		const fakeServer = new Server(tr, tr, 0x00040000);

		const emojis = EMOJI_STORAGE_MODULE.getByCategory(category);

		for (let emoji of emojis) {
			fakeServer.addEmoji(
				new Emoji(
					emoji.uniqueName,
					emoji.uniqueName,
					emoji.managed,
					emoji.allNamesString.includes(':'),
					[],
					emoji.defaultUrl
				)
			);
		}

		commonEmojis.push(fakeServer);
		$commonEmojisSpansCacheSpan.append(Picker.buildServerSpan(fakeServer));
	}

	return Promise.resolve({
		emojis: commonEmojis,
		spanCache: $commonEmojisSpansCacheSpan.html()
	});
}

function doGetEmojis() {
	const token = LOCAL_STORAGE_MODULE.impl.get(TOKEN_KEY);

	$.ajaxSetup({
		crossDomain: true,
		headers: {
			authorization: token
		}
	});

	return getMyId()
		.then(getServers)
		.then(parseServers)
		.then(loadStandartEmojis)
		.catch(e => {
			console.error('Error initializing Better Emojis!\nProbably modules order has been changed\n', e);
		});
}

module.exports = doGetEmojis;

},{"./constants.js":5,"./emoji.js":6,"./helpers.js":7,"./picker.js":12,"./server.js":13}],9:[function(require,module,exports){
/*! Clusterize.js - v0.17.6 - 2017-03-05
 * http://NeXTs.github.com/Clusterize.js/
 * Copyright (c) 2015 Denis Lukov; Licensed GPLv3 */

;
(function (name, definition) {
	if (typeof module !== 'undefined') module.exports = definition();
	else if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
	else this[name] = definition();
}('Clusterize', function () {

	'use strict'

	// detect ie9 and lower
	// https://gist.github.com/padolsey/527683#comment-786682
	var ie = (function () {
			for (var v = 3,
					el = document.createElement('b'),
					all = el.all || []; el.innerHTML = '<!--[if gt IE ' + (++v) + ']><i><![endif]-->',
				all[0];
			) {}

			return v > 4 ? v : document.documentMode;
		}()),

		is_mac = navigator.platform.toLowerCase().indexOf('mac') + 1;
	var Clusterize = function (data) {
		if (!(this instanceof Clusterize)) {
			return new Clusterize(data);
		}

		var self = this;

		var defaults = {
			rows_in_block: 50,
			blocks_in_cluster: 4,
			tag: null,
			show_no_data_row: true,
			no_data_class: 'clusterize-no-data',
			no_data_text: 'No data',
			keep_parity: true,
			callbacks: {}
		};

		// public parameters
		self.options = {};
		var options = ['rows_in_block', 'blocks_in_cluster', 'show_no_data_row', 'no_data_class', 'no_data_text', 'keep_parity', 'tag', 'callbacks'];
		for (var i = 0, option; option = options[i]; i++) {
			self.options[option] = typeof data[option] !== 'undefined' && data[option] != null ?
				data[option] :
				defaults[option];
		}

		var elems = ['scroll', 'content'];
		for (var i = 0, elem; elem = elems[i]; i++) {
			self[elem + '_elem'] = data[elem + 'Id'] ?
				document.getElementById(data[elem + 'Id']) :
				data[elem + 'Elem'];
			if (!self[elem + '_elem']) {
				throw new Error('Error! Could not find ' + elem + ' element');
			}
		}

		// tabindex forces the browser to keep focus on the scrolling list, fixes #11
		if (!self.content_elem.hasAttribute('tabindex')) {
			self.content_elem.setAttribute('tabindex', 0);
		}

		// private parameters
		var rows = isArray(data.rows) ?
			data.rows :
			self.fetchMarkup(),
			cache = {},
			scroll_top = self.scroll_elem.scrollTop;

		// append initial data
		self.insertToDOM(rows, cache);

		// restore the scroll position
		self.scroll_elem.scrollTop = scroll_top;

		// adding scroll handler
		var last_cluster = false,
			scroll_debounce = 0,
			pointer_events_set = false,
			scrollEv = function () {
				// fixes scrolling issue on Mac #3
				if (is_mac) {
					if (!pointer_events_set) self.content_elem.style.pointerEvents = 'none';
					pointer_events_set = true;
					clearTimeout(scroll_debounce);
					scroll_debounce = setTimeout(function () {
						self.content_elem.style.pointerEvents = 'auto';
						pointer_events_set = false;
					}, 50);
				}

				if (last_cluster != (last_cluster = self.getClusterNum())) {
					self.insertToDOM(rows, cache);
				}

				if (self.options.callbacks.scrollingProgress) {
					self.options.callbacks.scrollingProgress(self.getScrollProgress());
				}
			},

			resize_debounce = 0,
			resizeEv = function () {
				clearTimeout(resize_debounce);
				resize_debounce = setTimeout(self.refresh, 100);
			};

		on('scroll', self.scroll_elem, scrollEv);
		on('resize', window, resizeEv);

		// public methods
		self.destroy = function (clean) {
			off('scroll', self.scroll_elem, scrollEv);
			off('resize', window, resizeEv);
			self.html((clean ? self.generateEmptyRow() : rows).join(''));
		};

		self.refresh = function (force) {
			if (self.getRowsHeight(rows) || force) self.update(rows);
		};

		self.update = function (new_rows) {
			rows = isArray(new_rows) ?
				new_rows :
				[]
			var scroll_top = self.scroll_elem.scrollTop
			// fixes #39
			if (rows.length * self.options.item_height < scroll_top) {
				self.scroll_elem.scrollTop = 0
				last_cluster = 0
			}
			self.insertToDOM(rows, cache)
			self.scroll_elem.scrollTop = scroll_top
		}
		self.clear = function() {
			self.update([])
		}
		self.getRowsAmount = function() {
			return rows.length
		}
		self.getScrollProgress = function() {
			return this.options.scroll_top / (rows.length * this.options.item_height) * 100 || 0
		}

		var add = function(where, _new_rows) {
			var new_rows = isArray(_new_rows) ?
				_new_rows :
				[]
			if (!new_rows.length) return
			rows = where == 'append' ?
				rows.concat(new_rows) :
				new_rows.concat(rows)
			self.insertToDOM(rows, cache)
		}
		self.append = function(rows) {
			add('append', rows)
		}
		self.prepend = function(rows) {
			add('prepend', rows)
		}
	}

	Clusterize.prototype = {
		constructor: Clusterize,
		// fetch existing markup
		fetchMarkup: function() {
			var rows = [],
				rows_nodes = this.getChildNodes(this.content_elem)
			while (rows_nodes.length) {
				rows.push(rows_nodes.shift().outerHTML)
			}
			return rows
		},
		// get tag name, content tag name, tag height, calc cluster height
		exploreEnvironment: function(rows, cache) {
			var opts = this.options
			opts.content_tag = this.content_elem.tagName.toLowerCase()
			if (!rows.length) return
			if (ie && ie <= 9 && !opts.tag) opts.tag = rows[0].match(/<([^>\s/]*)/)[1].toLowerCase()
			if (this.content_elem.children.length <= 1) cache.data = this.html(rows[0] + rows[0] + rows[0])
			if (!opts.tag) opts.tag = this.content_elem.children[0].tagName.toLowerCase()
			this.getRowsHeight(rows)
		},
		getRowsHeight: function(rows) {
			var opts = this.options,
				prev_item_height = opts.item_height
			opts.cluster_height = 0
			if (!rows.length) return
			var nodes = this.content_elem.children
			var node = nodes[Math.floor(nodes.length / 2)]
			opts.item_height = node.offsetHeight
			// consider table's border-spacing
			if (opts.tag == 'tr' && getStyle('borderCollapse', this.content_elem) != 'collapse') {
				opts.item_height += parseInt(getStyle('borderSpacing', this.content_elem), 10) || 0
			}
			// consider margins (and margins collapsing)
			if (opts.tag != 'tr') {
				var marginTop = parseInt(getStyle('marginTop', node), 10) || 0
				var marginBottom = parseInt(getStyle('marginBottom', node), 10) || 0
				opts.item_height += Math.max(marginTop, marginBottom)
			}
			opts.block_height = opts.item_height * opts.rows_in_block
			opts.rows_in_cluster = opts.blocks_in_cluster * opts.rows_in_block
			opts.cluster_height = opts.blocks_in_cluster * opts.block_height
			return prev_item_height != opts.item_height
		},
		// get current cluster number
		getClusterNum: function() {
			this.options.scroll_top = this.scroll_elem.scrollTop
			return Math.floor(this.options.scroll_top / (this.options.cluster_height - this.options.block_height)) || 0
		},
		// generate empty row if no data provided
		generateEmptyRow: function() {
			var opts = this.options
			if (!opts.tag || !opts.show_no_data_row) return []
			var empty_row = document.createElement(opts.tag),
				no_data_content = document.createTextNode(opts.no_data_text),
				td
			empty_row.className = opts.no_data_class
			if (opts.tag == 'tr') {
				td = document.createElement('td')
				// fixes #53
				td.colSpan = 100
				td.appendChild(no_data_content)
			}
			empty_row.appendChild(td || no_data_content)
			return [empty_row.outerHTML]
		},
		// generate cluster for current scroll position
		generate: function(rows, cluster_num) {
			var opts = this.options,
				rows_len = rows.length
			if (rows_len < opts.rows_in_block) {
				return {
					top_offset: 0,
					bottom_offset: 0,
					rows_above: 0,
					rows: rows_len ? rows : this.generateEmptyRow()
				}
			}
			var items_start = Math.max((opts.rows_in_cluster - opts.rows_in_block) * cluster_num, 0),
				items_end = items_start + opts.rows_in_cluster,
				top_offset = Math.max(items_start * opts.item_height, 0),
				bottom_offset = Math.max((rows_len - items_end) * opts.item_height, 0),
				this_cluster_rows = [],
				rows_above = items_start
			if (top_offset < 1) {
				rows_above++
			}
			for (var i = items_start; i < items_end; i++) {
				rows[i] && this_cluster_rows.push(rows[i])
			}
			return {
				top_offset: top_offset,
				bottom_offset: bottom_offset,
				rows_above: rows_above,
				rows: this_cluster_rows
			}
		},
		renderExtraTag: function(class_name, height) {
			var tag = document.createElement(this.options.tag),
				clusterize_prefix = 'clusterize-'
			tag.className = [clusterize_prefix + 'extra-row', clusterize_prefix + class_name].join(' ')
			height && (tag.style.height = height + 'px')
			return tag.outerHTML
		},
		// if necessary verify data changed and insert to DOM
		insertToDOM: function(rows, cache) {
			// explore row's height
			if (!this.options.cluster_height) {
				this.exploreEnvironment(rows, cache)
			}
			var data = this.generate(rows, this.getClusterNum()),
				this_cluster_rows = data.rows.join(''),
				this_cluster_content_changed = this.checkChanges('data', this_cluster_rows, cache),
				top_offset_changed = this.checkChanges('top', data.top_offset, cache),
				only_bottom_offset_changed = this.checkChanges('bottom', data.bottom_offset, cache),
				callbacks = this.options.callbacks,
				layout = []

			if (this_cluster_content_changed || top_offset_changed) {
				if (data.top_offset) {
					this.options.keep_parity && layout.push(this.renderExtraTag('keep-parity'))
					layout.push(this.renderExtraTag('top-space', data.top_offset))
				}
				layout.push(this_cluster_rows)
				data.bottom_offset && layout.push(this.renderExtraTag('bottom-space', data.bottom_offset))
				callbacks.clusterWillChange && callbacks.clusterWillChange()
				this.html(layout.join(''))
				this.options.content_tag == 'ol' && this.content_elem.setAttribute('start', data.rows_above)
				callbacks.clusterChanged && callbacks.clusterChanged()
			} else if (only_bottom_offset_changed) {
				this.content_elem.lastChild.style.height = data.bottom_offset + 'px'
			}
		},
		// unfortunately ie <= 9 does not allow to use innerHTML for table elements, so make a workaround
		html: function(data) {
			var content_elem = this.content_elem
			if (ie && ie <= 9 && this.options.tag == 'tr') {
				var div = document.createElement('div'),
					last
				div.innerHTML = '<table><tbody>' + data + '</tbody></table>'
				while ((last = content_elem.lastChild)) {
					content_elem.removeChild(last)
				}
				var rows_nodes = this.getChildNodes(div.firstChild.firstChild)
				while (rows_nodes.length) {
					content_elem.appendChild(rows_nodes.shift())
				}
			} else {
				content_elem.innerHTML = data
			}
		},
		getChildNodes: function(tag) {
			var child_nodes = tag.children,
				nodes = []
			for (var i = 0, ii = child_nodes.length; i < ii; i++) {
				nodes.push(child_nodes[i])
			}
			return nodes
		},
		checkChanges: function(type, value, cache) {
			var changed = value != cache[type]
			cache[type] = value
			return changed
		}
	}

	// support functions
	function on(evt, element, fnc) {
		return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent('on' + evt, fnc)
	}

	function off(evt, element, fnc) {
		return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent('on' + evt, fnc)
	}

	function isArray(arr) {
		return Object.prototype.toString.call(arr) === '[object Array]'
	}

	function getStyle(prop, elem) {
		return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop]
	}

	return Clusterize
}))

},{}],10:[function(require,module,exports){
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
		SettingsPanel.updateHiddenServers();
		console.log('Better Emojis initialized');
	}, 2000);
});

},{"./constants.js":5,"./initializer.js":8,"./observer.js":11,"./picker.js":12,"./settings-panel.js":14,"./settings.js":15}],11:[function(require,module,exports){
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
		if (!listener) {
			return;
		}

		if (typeof listener !== 'function') {
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

},{}],12:[function(require,module,exports){
'use strict';

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
} = require('./constants.js');

let commonEmojisSpansCache = '';

let SCROLLER_WRAP = null;
let SCROLLER_WRAP_OLD = null;
let SEARCH_INPUT = null;

function buildScrollerWrap() {
	const $wrap = SCROLLER_WRAP || $(ELEMENT_SCROLLER_WRAP);
	const $scr = $wrap.find('.scroller');

	$scr.html(' ').off('click').off('mouseenter').off('mouseleave');

	const currentServer = Server.getCurrentServer();

	// Append all current server emojis, if any
	if (currentServer.emojis.length > 0) {
		$scr.append(buildServerSpan(currentServer));
	}

	// Append all other server shared emojis
	if (currentServer.canUseExternalEmojis) {
		for (const server of Server.getAllServers()) {
			if (!server.isCurrent() && server.isShownInPicker()
				&& server.sharedEmojis.length > 0 && IS_NUMBER_REGEX.test(server.id)
			) {
				$scr.append(buildServerSpan(server));
			}
		}
	}

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

	const serverContext = CUSTOM_EMOJI_STORAGE_MODULE.getDisambiguatedEmojiContext(currentServer.id);

	const emojiClickHandler = $(`.${EMOJI_BUTTON_CLASS}`).hasClass('popout-open')
		? putEmojiInTextarea
		: addCurrentMessageReaction;

	$scr
	.on('click', '.emoji-item', e => {
		console.log('Selected emoji - ', Emoji.getById($(e.target).attr('data-emoji')));
	})
	.on('click', '.emoji-item', e => {
		emojiClickHandler(serverContext.getById($(e.target).attr('data-emoji')));
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

	return $wrap;
}

function buildServerSpan(server) {
	const $emojiList = $(ELEMENT_SERVER_EMOJI_LIST);

	$emojiList.find('.category').html(server.name);
	$emojiList.append(buildEmojisRows(server.availableEmojis()));

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

function showOriginalScroller() {
	SCROLLER_WRAP.hide().parent();
	SCROLLER_WRAP_OLD.show();
}

function showCustomScroller() {
	SCROLLER_WRAP.show();
	SCROLLER_WRAP_OLD.hide();
	SCROLLER_WRAP.find('.scroller').scrollTop(0);
}

function replaceScroller() {
	SCROLLER_WRAP = buildScrollerWrap();
	SCROLLER_WRAP_OLD = $(EMOJI_PICKER_PATH).find('.scroller-wrap');
	SCROLLER_WRAP_OLD.hide().before(SCROLLER_WRAP);
}

function replaceSearchInput() {
	// SEARCH_INPUT = buildSearchInput();
	// $(EMOJI_PICKER_PATH).find("input").hide().before(SEARCH_INPUT);
	// Temporary disabled, as original search have much better performance
	let $picker = $(EMOJI_PICKER_PATH);
	SEARCH_INPUT = $picker.find('input');

	SEARCH_INPUT.on('change keydown keyup paste', () => {
		let $wrap = $picker.find('.scroller-wrap, .no-search-results');

		if (SEARCH_INPUT.val()) {
			$wrap.filter('.tl-emoji-scroller-wrap').hide();
			$wrap.not('.tl-emoji-scroller-wrap').show();
		} else {
			$wrap.filter('.tl-emoji-scroller-wrap').show();
			$wrap.not('.tl-emoji-scroller-wrap').hide();
		}
	});
}

function addCustomScrollerParts() {
	// console.log("picker opened");

	setTimeout(() => {
		setTimeout(showCustomScroller, 10);

		replaceScroller();
		replaceSearchInput();

		const categories = $(EMOJI_PICKER_PATH).find('.categories');
		const categoriesChildren = categories.children();
		const customScroller = ['recent', 'custom'];

		categories.on('click', '.item', function (event) {
			const $this = $(this);

			categoriesChildren.removeClass('selected');
			$this.addClass('selected');

			customScroller.forEach(function (category) {
				if ($this.hasClass(category)) {
					showCustomScroller.call(this, event);
				}
			});

			showOriginalScroller.call(this, event);
		});

	}, 20);
}

module.exports.buildServerSpan = buildServerSpan;
module.exports.show = addCustomScrollerParts;

module.exports.setCommonEmojiSpanCache = function (cache) {
	commonEmojisSpansCache = cache;
};

},{"./constants.js":5,"./emoji.js":6,"./helpers":7,"./lib/clusterize.js":9,"./server.js":13,"./settings.js":15}],13:[function(require,module,exports){
'use strict';

const Emoji = require('./emoji.js');
const Settings = require('./settings.js');

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
		this[serverRegex] = new RegExp(`.*/${_id.toString()}/\\d+`);

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

	isGuild() {
		return /\d+/.test(this[id]);
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

	isShownInList() {
		return Settings.get(`serverlist.show.${this[id]}`, true);
	}

	isShownInPicker() {
		return Settings.get(`picker.server.show.${this[id]}`, true);
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

},{"./emoji.js":6,"./settings.js":15}],14:[function(require,module,exports){
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
		}
	}));

	const guildsIcons = getServersIcons();
	const servers = Server.getAllServers();

	for (const server of servers) {
		if (server.isGuild())
			$contentDiv.append(serverCard(server, guildsIcons));
	}

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
		<div class="${CARD_CLASSES.cardPrimary} ${SERVER_CARD_CLASSES.serverCard}" id="server-card-${server.id}" style="padding: 7px">
			<div class="${getClasses(FLEX_CLASSES, ['horizontal', 'flex', 'justifyStart', 'alignStretch', 'noWrap'])}">
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
		</div>
	`);

	//jscs:enable maximumLineLength
	$card.find(`.${SERVER_CARD_CLASSES.showInServerList}`).click(function () {
		const $switch = $(this).find(`.${SERVER_CARD_CLASSES.showInServerListSwitch}`);

		$switch.toggleClass(SWITCH_CLASSES.checked);

		const isShown = $switch.hasClass(SWITCH_CLASSES.checked);

		Settings.set(`serverlist.show.${server.id}`, isShown);

		updateHiddenServers();
	});

	$card.find(`.${SERVER_CARD_CLASSES.showInPicker}`).click(function () {
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

		if (server.isShownInList()) {
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

},{"./classes.js":4,"./constants.js":5,"./server.js":13,"./settings.js":15}],15:[function(require,module,exports){
'use strict';

const {
	LOCAL_STORAGE_MODULE,
	BETTER_EMOJIS_KEY,
} = require('./constants.js');

//FIXME empty object returned for require('fs')
const fs = require('fs');
const path = require('path');

const defaultSettings = { enabled: true };

const fileLocation =
	typeof window.betterEmojiLocation !== 'undefined' &&
	fs.readFileSync && fs.writeFileSync && path.resolve ?
	path.resolve(window.betterEmojiLocation, 'config.json') : null;

const loadedSettings = loadSettings();

const settings = Object.assign(defaultSettings, loadedSettings);

function loadSettings() {
	try {
		return JSON.parse(fs.readFileSync(path.resolve(fileLocation, 'config.json'), 'utf-8'));
	} catch (err) {
		console.log('Error loading settings from file:', err);
		return JSON.parse(LOCAL_STORAGE_MODULE.impl.get(BETTER_EMOJIS_KEY));
	}
}

function saveSettings() {
	if (fileLocation) {
		fs.writeFileSync(path.resolve(fileLocation, 'config.json'), JSON.stringify(settings, null, '\t'));
	} else {
		LOCAL_STORAGE_MODULE.impl.set(BETTER_EMOJIS_KEY, JSON.stringify(settings));
	}
}

exports.set = function (key, value) {
	settings[key] = value;
	saveSettings();
};

function valueOrDefault(value, def) {
	if (value === null || typeof value === 'undefined') {
		return def;
	}

	return value;
}

exports.get = function (key, def) {
	return valueOrDefault(settings[key], def);
};

},{"./constants.js":5,"fs":1,"path":2}]},{},[10])
//# sourceMappingURL=better-emojis.js.map
