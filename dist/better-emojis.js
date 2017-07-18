(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports.API_BASE = 'https://discordapp.com/api'

function n (id) {
  return webpackJsonp([], [], [id])
}

/* May be changed with discord updates */
module.exports.EMOJI_PICKER_PATH = '#app-mount > div > div:nth-child(7)'
module.exports.LOCAL_STORAGE_MODULE = n(1590)
module.exports.EMOJI_STORAGE_MODULE = n(168).default
module.exports.TRANSLATION_MODULE = n(3)
module.exports.TOKEN_KEY = n(0).TOKEN_KEY
/* May be changed with discord updates.END */

module.exports.ELEMENT_SCROLLER_WRAP = '<div class="scroller-wrap"><div class="scroller"></div></div>'

module.exports.ELEMENT_SEARCH_INPUT = '<input type="text" placeholder="Find the perfect emoji" value="">'

module.exports.ELEMENT_SERVER_EMOJI_LIST = '<span class="server-emojis"><div class="category">server.name</div></span>'
module.exports.ELEMENT_SERVER_EMOJI_LIST_ROW = '<div class="row"></div>'
module.exports.ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY = '<div class="emoji-item"></div>' // max 10 per row

module.exports.REACTION_POPOUT_REGEX = /TOGGLE_REACTION_POPOUT_(\d+)/
module.exports.CURRENT_SELECTED_CHANNEL_REGEX = /.*\/.+\/(\d+)/
module.exports.IS_INBOX_REGEX = /\/channels\/@me\/\d+/

module.exports.IS_NUMBER_REGEX = /\d+/

},{}],2:[function(require,module,exports){
const id = Symbol('id')
const name = Symbol('name')
const url = Symbol('url')
const managed = Symbol('managed')
const requireColons = Symbol('requireColons')
const roles = Symbol('roles')

class Emoji {
  constructor (_id, _name, _managed = false, _requireColons = true, _roles = [], _url = `https://cdn.discordapp.com/emojis/${_id}.png`) {
    this[id] = _id
    this[name] = _name
    this[url] = _url
    this[managed] = _managed
    this[requireColons] = _requireColons
    this[roles] = _roles
  }

  get id () {
    return this[id]
  }

  get name () {
    return this[name]
  }

  get url () {
    return this[url]
  }

  get isManaged () {
    return this[managed]
  }

  get colonsRequired () {
    return this[requireColons]
  }

  get roles () {
    return this[roles]
  }

  get useName () {
    return this.colonsRequired ? `:${this.name}:` : this.name
  }

  static fromRaw (emojiRaw) {
    return new Emoji(emojiRaw.id, emojiRaw.name, emojiRaw.managed, emojiRaw.requireColons, emojiRaw.roles)
  }
}

module.exports = Emoji

},{}],3:[function(require,module,exports){
const Server = require('./server.js')
const Emoji = require('./emoji.js')
const Constants = require('./constants.js')
const Picker = require('./picker.js')

let MY_ID = ''

function getServers () {
  return new Promise((resolve, reject) => {
    $.ajax({
      'async': true,
      'url': `${Constants.API_BASE}/users/@me/guilds`,
      'method': 'GET'
    })
    .then(res => resolve(res))
    .fail(err => reject(err))
  })
}

function getMyId () {
  return new Promise((resolve, reject) => {
    $.ajax({
      'async': true,
      'url': `${Constants.API_BASE}/users/@me`,
      'method': 'GET'
    })
    .then(response => {
      MY_ID = response.id
    })
    .then(res => resolve(res))
    .fail(err => reject(err))
  })
}

function parseServer (server) {
  return new Promise((resolve, reject) => {
    $.ajax({
      'async': true,
      'url': `${Constants.API_BASE}/guilds/${server.id}/members/${MY_ID}`,
      'method': 'GET'
    }).done(response => {
      const myRoles = response.roles
      $.ajax({
        'async': true,
        'url': `${Constants.API_BASE}/guilds/${server.id}`,
        'method': 'GET'
      }).done(response => {
        // now we got detailed info about server. fill emoji and managed emojis.
        // also set name
        const srv = new Server(response.id, response.name, server.permissions)

        response.emojis.forEach(emojiRaw => {
          // get emoji required roles
          const emoji = Emoji.fromRaw(emojiRaw)
          const eR = emoji.roles

          if (!eR.length) {
            srv.addEmoji(emoji)
            return
          }

          for (const r in eR) {
            // we have required role
            if (myRoles.includes(r)) {
              srv.addEmoji(emoji)
              break
            }
          }
        })
        resolve(srv)
      })
    })
  })
}

function parseServers (serversA) {
  return Promise.all(serversA.map(srv => parseServer(srv)))
}

function loadStandartEmojis () {
  let commonEmojis = []

  return new Promise((resolve, reject) => {
    const translation = Constants.TRANSLATION_MODULE.Messages
    const categories = Constants.EMOJI_STORAGE_MODULE.getCategories()
    let commonEmojisSpansCacheSpan = $('<span></span>')

    for (let category of categories) {
      const tr = translation[`EMOJI_CATEGORY_${category.toUpperCase()}`]
      const fakeServer = new Server(tr, tr, 0x00040000)

      const emojis = Constants.EMOJI_STORAGE_MODULE.getByCategory(category)

      for (let emoji of emojis) {
        fakeServer.addEmoji(new Emoji(emoji.index, emoji.uniqueName, emoji.managed, emoji.allNamesString.includes(':'), [], emoji.defaultUrl))
      }

      commonEmojis.push(fakeServer)
      commonEmojisSpansCacheSpan.append(Picker.buildServerSpan(fakeServer))
    }

    resolve({emojis: commonEmojis, spanCache: commonEmojisSpansCacheSpan.html()})
  })
}

function doGetEmojis () {
  const token = Constants.LOCAL_STORAGE_MODULE.impl.get(Constants.TOKEN_KEY)

  $.ajaxSetup({
    'crossDomain': true,
    'headers': { 'authorization': token }
  })

  return getMyId()
    .then(getServers)
    .then(parseServers)
    .then(loadStandartEmojis)
    .catch(e => { console.error('Error initializing Better Emojis!\nProbably modules order has been changed\n', e) })
}

module.exports = doGetEmojis

},{"./constants.js":1,"./emoji.js":2,"./picker.js":6,"./server.js":7}],4:[function(require,module,exports){
/*! Clusterize.js - v0.17.6 - 2017-03-05
* http://NeXTs.github.com/Clusterize.js/
* Copyright (c) 2015 Denis Lukov; Licensed GPLv3 */

;(function (name, definition) {
  if (typeof module !== 'undefined') module.exports = definition()
  else if (typeof define === 'function' && typeof define.amd === 'object') define(definition)
  else this[name] = definition()
}('Clusterize', function () {
  'use strict'

  // detect ie9 and lower
  // https://gist.github.com/padolsey/527683#comment-786682
  var ie = (function () {
      for (var v = 3,
        el = document.createElement('b'),
        all = el.all || [];
         el.innerHTML = '<!--[if gt IE ' + (++v) + ']><i><![endif]-->',
         all[0];
       ) {}
      return v > 4 ? v : document.documentMode
    }()),
    is_mac = navigator.platform.toLowerCase().indexOf('mac') + 1
  var Clusterize = function (data) {
    if (!(this instanceof Clusterize)) { return new Clusterize(data) }
    var self = this

    var defaults = {
      rows_in_block: 50,
      blocks_in_cluster: 4,
      tag: null,
      show_no_data_row: true,
      no_data_class: 'clusterize-no-data',
      no_data_text: 'No data',
      keep_parity: true,
      callbacks: {}
    }

    // public parameters
    self.options = {}
    var options = ['rows_in_block', 'blocks_in_cluster', 'show_no_data_row', 'no_data_class', 'no_data_text', 'keep_parity', 'tag', 'callbacks']
    for (var i = 0, option; option = options[i]; i++) {
      self.options[option] = typeof data[option] !== 'undefined' && data[option] != null
        ? data[option]
        : defaults[option]
    }

    var elems = ['scroll', 'content']
    for (var i = 0, elem; elem = elems[i]; i++) {
      self[elem + '_elem'] = data[elem + 'Id']
        ? document.getElementById(data[elem + 'Id'])
        : data[elem + 'Elem']
      if (!self[elem + '_elem']) { throw new Error('Error! Could not find ' + elem + ' element') }
    }

    // tabindex forces the browser to keep focus on the scrolling list, fixes #11
    if (!self.content_elem.hasAttribute('tabindex')) { self.content_elem.setAttribute('tabindex', 0) }

    // private parameters
    var rows = isArray(data.rows)
        ? data.rows
        : self.fetchMarkup(),
      cache = {},
      scroll_top = self.scroll_elem.scrollTop

    // append initial data
    self.insertToDOM(rows, cache)

    // restore the scroll position
    self.scroll_elem.scrollTop = scroll_top

    // adding scroll handler
    var last_cluster = false,
      scroll_debounce = 0,
      pointer_events_set = false,
      scrollEv = function () {
      // fixes scrolling issue on Mac #3
        if (is_mac) {
          if (!pointer_events_set) self.content_elem.style.pointerEvents = 'none'
          pointer_events_set = true
          clearTimeout(scroll_debounce)
          scroll_debounce = setTimeout(function () {
            self.content_elem.style.pointerEvents = 'auto'
            pointer_events_set = false
          }, 50)
        }
        if (last_cluster != (last_cluster = self.getClusterNum())) { self.insertToDOM(rows, cache) }
        if (self.options.callbacks.scrollingProgress) { self.options.callbacks.scrollingProgress(self.getScrollProgress()) }
      },
      resize_debounce = 0,
      resizeEv = function () {
        clearTimeout(resize_debounce)
        resize_debounce = setTimeout(self.refresh, 100)
      }
    on('scroll', self.scroll_elem, scrollEv)
    on('resize', window, resizeEv)

    // public methods
    self.destroy = function (clean) {
      off('scroll', self.scroll_elem, scrollEv)
      off('resize', window, resizeEv)
      self.html((clean ? self.generateEmptyRow() : rows).join(''))
    }
    self.refresh = function (force) {
      if (self.getRowsHeight(rows) || force) self.update(rows)
    }
    self.update = function (new_rows) {
      rows = isArray(new_rows)
        ? new_rows
        : []
      var scroll_top = self.scroll_elem.scrollTop
      // fixes #39
      if (rows.length * self.options.item_height < scroll_top) {
        self.scroll_elem.scrollTop = 0
        last_cluster = 0
      }
      self.insertToDOM(rows, cache)
      self.scroll_elem.scrollTop = scroll_top
    }
    self.clear = function () {
      self.update([])
    }
    self.getRowsAmount = function () {
      return rows.length
    }
    self.getScrollProgress = function () {
      return this.options.scroll_top / (rows.length * this.options.item_height) * 100 || 0
    }

    var add = function (where, _new_rows) {
      var new_rows = isArray(_new_rows)
        ? _new_rows
        : []
      if (!new_rows.length) return
      rows = where == 'append'
        ? rows.concat(new_rows)
        : new_rows.concat(rows)
      self.insertToDOM(rows, cache)
    }
    self.append = function (rows) {
      add('append', rows)
    }
    self.prepend = function (rows) {
      add('prepend', rows)
    }
  }

  Clusterize.prototype = {
    constructor: Clusterize,
    // fetch existing markup
    fetchMarkup: function () {
      var rows = [], rows_nodes = this.getChildNodes(this.content_elem)
      while (rows_nodes.length) {
        rows.push(rows_nodes.shift().outerHTML)
      }
      return rows
    },
    // get tag name, content tag name, tag height, calc cluster height
    exploreEnvironment: function (rows, cache) {
      var opts = this.options
      opts.content_tag = this.content_elem.tagName.toLowerCase()
      if (!rows.length) return
      if (ie && ie <= 9 && !opts.tag) opts.tag = rows[0].match(/<([^>\s/]*)/)[1].toLowerCase()
      if (this.content_elem.children.length <= 1) cache.data = this.html(rows[0] + rows[0] + rows[0])
      if (!opts.tag) opts.tag = this.content_elem.children[0].tagName.toLowerCase()
      this.getRowsHeight(rows)
    },
    getRowsHeight: function (rows) {
      var opts = this.options,
        prev_item_height = opts.item_height
      opts.cluster_height = 0
      if (!rows.length) return
      var nodes = this.content_elem.children
      var node = nodes[Math.floor(nodes.length / 2)]
      opts.item_height = node.offsetHeight
      // consider table's border-spacing
      if (opts.tag == 'tr' && getStyle('borderCollapse', this.content_elem) != 'collapse') { opts.item_height += parseInt(getStyle('borderSpacing', this.content_elem), 10) || 0 }
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
    getClusterNum: function () {
      this.options.scroll_top = this.scroll_elem.scrollTop
      return Math.floor(this.options.scroll_top / (this.options.cluster_height - this.options.block_height)) || 0
    },
    // generate empty row if no data provided
    generateEmptyRow: function () {
      var opts = this.options
      if (!opts.tag || !opts.show_no_data_row) return []
      var empty_row = document.createElement(opts.tag),
        no_data_content = document.createTextNode(opts.no_data_text), td
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
    generate: function (rows, cluster_num) {
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
    renderExtraTag: function (class_name, height) {
      var tag = document.createElement(this.options.tag),
        clusterize_prefix = 'clusterize-'
      tag.className = [clusterize_prefix + 'extra-row', clusterize_prefix + class_name].join(' ')
      height && (tag.style.height = height + 'px')
      return tag.outerHTML
    },
    // if necessary verify data changed and insert to DOM
    insertToDOM: function (rows, cache) {
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
    html: function (data) {
      var content_elem = this.content_elem
      if (ie && ie <= 9 && this.options.tag == 'tr') {
        var div = document.createElement('div'), last
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
    getChildNodes: function (tag) {
      var child_nodes = tag.children, nodes = []
      for (var i = 0, ii = child_nodes.length; i < ii; i++) {
        nodes.push(child_nodes[i])
      }
      return nodes
    },
    checkChanges: function (type, value, cache) {
      var changed = value != cache[type]
      cache[type] = value
      return changed
    }
  }

  // support functions
  function on (evt, element, fnc) {
    return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent('on' + evt, fnc)
  }
  function off (evt, element, fnc) {
    return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent('on' + evt, fnc)
  }
  function isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }
  function getStyle (prop, elem) {
    return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop]
  }

  return Clusterize
}))

},{}],5:[function(require,module,exports){
const Constants = require('./constants.js')
const Picker = require('./picker.js')

const initEmojis = require('./initializer.js')

function watchForEmojiPickerChange (listener) {
  const observer = new MutationObserver(mutations => {
    if (typeof listener === 'function') {
      listener(mutations)
    }
  })
  observer.observe($(Constants.EMOJI_PICKER_PATH)[0], { childList: true })
  return observer
}

initEmojis().then((spanCache) => {
  Picker.setCommonEmojiSpanCache(spanCache.spanCache)
  console.log('Better Emojis initialized')
  setTimeout(() => {
    window.better_emojis.observer = watchForEmojiPickerChange(([mutation]) => {
      if (mutation.type === 'childList') {
        if (mutation.addedNodes.length > 0) {
          if ($(Constants.EMOJI_PICKER_PATH).find('.emoji-picker').length &&
                    ($('.channel-textarea-emoji').hasClass('popout-open') || $('.btn-reaction.popout-open').length)) {
            Picker.show()
          }
        }
        if (mutation.removedNodes.length) {
          if (window.better_emojis.current_cluster) {
            window.better_emojis.current_cluster.destroy()
          }
        }
      }
    })
  }, 2000)
})

},{"./constants.js":1,"./initializer.js":3,"./picker.js":6}],6:[function(require,module,exports){
const Constants = require('./constants.js')
const Clusterize = require('./lib/clusterize.js')
const Server = require('./server.js')

let commonEmojisSpansCache = ''
let currentPickerEmojiRegistry = []

let SCROLLER_WRAP = null
let SCROLLER_WRAP_OLD = null
let SEARCH_INPUT = null

function buildScrollerWrap () {
  const s = SCROLLER_WRAP || $(Constants.ELEMENT_SCROLLER_WRAP)
  const scr = s.find('.scroller')

  scr.html(' ').off('click').off('mouseenter').off('mouseleave')
  currentPickerEmojiRegistry.length = 0

  const c = Server.getCurrentServer()
    // Append all current server emojis, if any
  if (c.emojis.length > 0) { scr.append(buildServerSpan(c)) }

    // Append all other server shared emojis
  if (c.canUseExternalEmojis) {
    for (const server of Server.getAllServers()) {
      if (!server.isCurrent() && server.sharedEmojis.length > 0 && Constants.IS_NUMBER_REGEX.test(server.id)) {
        scr.append(buildServerSpan(server))
      }
    }
  }

    // Append common emojis
  if (commonEmojisSpansCache) {
    scr.append(commonEmojisSpansCache)
  }

  window.better_emojis.current_cluster = new Clusterize({
    rows_in_block: 10,
    blocks_in_cluster: 3,
    scrollElem: scr[0],
    contentElem: scr[0]
  })

  const emojiClickHandler = $('.channel-textarea-emoji').hasClass('popout-open') ? putEmojiInTextarea : addCurrentMessageReaction

  scr
    .on('click', '.emoji-item', e => { console.log('Selected emoji - ', currentPickerEmojiRegistry[$(e.target).attr('data-emoji')]) })
    .on('click', '.emoji-item', e => { emojiClickHandler(currentPickerEmojiRegistry[$(e.target).attr('data-emoji')]) })
    .on('mouseenter', '.emoji-item', e => {
      $(e.target).addClass('selected')
      if (SEARCH_INPUT) {
        SEARCH_INPUT.attr('placeholder', currentPickerEmojiRegistry[$(e.target).attr('data-emoji')].useName)
      }
    })
    .on('mouseleave', '.emoji-item', e => {
      $(e.target).removeClass('selected')
      if (SEARCH_INPUT) {
        SEARCH_INPUT.attr('placeholder', 'Find the perfect emoji')
      }
    })

  return s
}

function buildServerSpan (server) {
  const s = $(Constants.ELEMENT_SERVER_EMOJI_LIST)
  s.find('.category').html(server.name)

  s.append(buildEmojisRows(server.availableEmojis()))

  return s.html()
}

function buildEmojisRows (eL) {
  const s = $('<span class="tl-emoji-list"></span>')
  let r = $(Constants.ELEMENT_SERVER_EMOJI_LIST_ROW)

  const emojiElement = function (emoji) {
    return $(Constants.ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY)
            .css('background-image', `url("${emoji.url}")`)
            .attr('data-emoji', `${currentPickerEmojiRegistry.push(emoji) - 1}`)
  }

  for (let i = 0; i < eL.length; i++) {
    if ((i !== 0) && (i % 10 === 0)) {
      s.append(r)
      r = $(Constants.ELEMENT_SERVER_EMOJI_LIST_ROW)
    }
    r.append(emojiElement(eL[i]))
  }
  s.append(r)

  return s.html()
}

function putEmojiInTextarea (emoji) {
  const textarea = $('.channel-textarea >> textarea')
  textarea.val(`${textarea.val() + emoji.useName} `)
}

function findReact (dom) {
  for (const key in dom) {
    if (key.startsWith('__reactInternalInstance$')) {
      return dom[key]
    }
  }
  return null
};

function getSelectedMessageId () {
  try {
    return Constants.REACTION_POPOUT_REGEX.exec(
            findReact($('.btn-reaction.popout-open').closest('.message').find('.message-text').get(0))
            ._currentElement.props.children
            .filter(c => {
              return Object.keys(c.props).includes('subscribeTo')
            })[0].props.subscribeTo)[1]
  } catch (e) {
    return null
  }
}

function getCurrentSelectedChannel () {
  return Constants.CURRENT_SELECTED_CHANNEL_REGEX.exec(window.location.pathname)[1]
}

function addCurrentMessageReaction (emoji) {
  return addMessageReaction(getCurrentSelectedChannel(), getSelectedMessageId(), emoji)
}

function addMessageReaction (channel, message, emoji) {
  $.ajax(`${Constants.API_BASE}/channels/${channel}/messages/${message}/reactions/:${emoji.name}:${emoji.id}/@me`, { method: 'PUT' })
}

function showOriginalScroller () {
  SCROLLER_WRAP.hide()
  SCROLLER_WRAP_OLD.show()
}

function showCustomScroller () {
  SCROLLER_WRAP.show()
  SCROLLER_WRAP_OLD.hide()
  SCROLLER_WRAP.find('.scroller').scrollTop(0)
}

function replaceScroller () {
  SCROLLER_WRAP = buildScrollerWrap()
  SCROLLER_WRAP_OLD = $(Constants.EMOJI_PICKER_PATH).find('.scroller-wrap')
  SCROLLER_WRAP_OLD.hide().before(SCROLLER_WRAP)
}

function replaceSearchInput () {
  // SEARCH_INPUT = buildSearchInput();
  // $(EMOJI_PICKER_PATH).find("input").hide().before(SEARCH_INPUT);
  // Temporary disabled, as original search have much better performance
  SEARCH_INPUT = $(Constants.EMOJI_PICKER_PATH).find('input')
  SEARCH_INPUT.change((e) => {
    if (!$(e.target).val()) {
      showCustomScroller()
    } else {
      showOriginalScroller()
    }
  })
}

function addCustomScrollerParts () {
    // console.log("picker opened");
  setTimeout(replaceScroller, 20)
  setTimeout(replaceSearchInput, 20)
  setTimeout(() => {
    const categories = $(Constants.EMOJI_PICKER_PATH).find('.categories')
    const categoriesChildren = categories.children()
    const customScroller = ['recent', 'custom']

    categories.on('click', '.item', function (event) {
      const $this = $(this)

      categoriesChildren.removeClass('selected')
      $this.addClass('selected')

      customScroller.forEach(function (category) {
        if ($this.hasClass(category)) {
          showCustomScroller.call(this, event)
        }
      })

      showOriginalScroller.call(this, event)
    })
  }, 20)
  setTimeout(showCustomScroller, 30)
}

module.exports.buildServerSpan = buildServerSpan
module.exports.show = addCustomScrollerParts

module.exports.setCommonEmojiSpanCache = function (cache) {
  commonEmojisSpansCache = cache
}

},{"./constants.js":1,"./lib/clusterize.js":4,"./server.js":7}],7:[function(require,module,exports){
const Emoji = require('./emoji.js')

const GLOBAL_SERVER_LIST = []

const id = Symbol('id')
const name = Symbol('name')
const emojis = Symbol('emojis')
const sharedEmojis = Symbol('sharedEmojis')
const permissions = Symbol('permissions')
const serverRegex = Symbol('serverRegex')

class Server {
  constructor (_id, _name, _permissions, _emojis = [], _sharedEmojis = []) {
    if (GLOBAL_SERVER_LIST.some(s => s.id === _id)) {
      throw new Error('Cannot have multiple servers with same id!')
    }

    this[id] = _id
    this[name] = _name
    this[permissions] = _permissions
    this[emojis] = _emojis
    this[sharedEmojis] = _sharedEmojis
    this[serverRegex] = new RegExp(`.*/${_id.toString()}/\\d+`)

    GLOBAL_SERVER_LIST.push(this)
  }

  addEmoji (emoji) {
    if (!(emoji instanceof Emoji)) {
      throw new TypeError('Only objects of class Emoji can be added using this method')
    }

    if (this[emojis].some(e => e.id === emoji.id)) {
      return
    }

    this[emojis].push(emoji)

    if (emoji.isManaged) {
      this[sharedEmojis].push(emoji)
    }

    return this
  }

  get canUseExternalEmojis () {
    return this[permissions] & 0x00040000
  }

  get id () {
    return this[id]
  }

  get name () {
    return this[name]
  }

  get permissions () {
    return this[permissions]
  }

  get emojis () {
    return this[emojis]
  }

  get sharedEmojis () {
    return this[sharedEmojis]
  }

  isCurrent () {
    return this[serverRegex].test(window.location)
  }

  availableEmojis () {
    return this.isCurrent() ? this.emojis : this.sharedEmojis
  }

  possibleEmojis () {
    const list = this.emojis

    for (const server of GLOBAL_SERVER_LIST) {
      if (server.id === this.id) {
        continue
      }

      list.push(...server.sharedEmojis)
    }

    return list
  }

  static getCurrentServer () {
    return GLOBAL_SERVER_LIST.reduce((p, c) => (p || (c.isCurrent() && c)), false) || null
  }

  static getAllServers () {
    return GLOBAL_SERVER_LIST
  }

  static getById (id) {
    return GLOBAL_SERVER_LIST.reduce((p, c) => (p || ((c.id === id) && c)), false) || null
  }
}

// Store "inbox" emulation of server
new Server('@me', '@me', 0x00040000) // eslint-disable-line no-new

module.exports = Server

},{"./emoji.js":2}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uc3RhbnRzLmpzIiwic3JjL2Vtb2ppLmpzIiwic3JjL2luaXRpYWxpemVyLmpzIiwic3JjL2xpYi9jbHVzdGVyaXplLmpzIiwic3JjL21haW4uanMiLCJzcmMvcGlja2VyLmpzIiwic3JjL3NlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25VQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzLkFQSV9CQVNFID0gJ2h0dHBzOi8vZGlzY29yZGFwcC5jb20vYXBpJ1xyXG5cclxuZnVuY3Rpb24gbiAoaWQpIHtcclxuICByZXR1cm4gd2VicGFja0pzb25wKFtdLCBbXSwgW2lkXSlcclxufVxyXG5cclxuLyogTWF5IGJlIGNoYW5nZWQgd2l0aCBkaXNjb3JkIHVwZGF0ZXMgKi9cclxubW9kdWxlLmV4cG9ydHMuRU1PSklfUElDS0VSX1BBVEggPSAnI2FwcC1tb3VudCA+IGRpdiA+IGRpdjpudGgtY2hpbGQoNyknXHJcbm1vZHVsZS5leHBvcnRzLkxPQ0FMX1NUT1JBR0VfTU9EVUxFID0gbigxNTkwKVxyXG5tb2R1bGUuZXhwb3J0cy5FTU9KSV9TVE9SQUdFX01PRFVMRSA9IG4oMTY4KS5kZWZhdWx0XHJcbm1vZHVsZS5leHBvcnRzLlRSQU5TTEFUSU9OX01PRFVMRSA9IG4oMylcclxubW9kdWxlLmV4cG9ydHMuVE9LRU5fS0VZID0gbigwKS5UT0tFTl9LRVlcclxuLyogTWF5IGJlIGNoYW5nZWQgd2l0aCBkaXNjb3JkIHVwZGF0ZXMuRU5EICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5FTEVNRU5UX1NDUk9MTEVSX1dSQVAgPSAnPGRpdiBjbGFzcz1cInNjcm9sbGVyLXdyYXBcIj48ZGl2IGNsYXNzPVwic2Nyb2xsZXJcIj48L2Rpdj48L2Rpdj4nXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5FTEVNRU5UX1NFQVJDSF9JTlBVVCA9ICc8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkZpbmQgdGhlIHBlcmZlY3QgZW1vamlcIiB2YWx1ZT1cIlwiPidcclxuXHJcbm1vZHVsZS5leHBvcnRzLkVMRU1FTlRfU0VSVkVSX0VNT0pJX0xJU1QgPSAnPHNwYW4gY2xhc3M9XCJzZXJ2ZXItZW1vamlzXCI+PGRpdiBjbGFzcz1cImNhdGVnb3J5XCI+c2VydmVyLm5hbWU8L2Rpdj48L3NwYW4+J1xyXG5tb2R1bGUuZXhwb3J0cy5FTEVNRU5UX1NFUlZFUl9FTU9KSV9MSVNUX1JPVyA9ICc8ZGl2IGNsYXNzPVwicm93XCI+PC9kaXY+J1xyXG5tb2R1bGUuZXhwb3J0cy5FTEVNRU5UX1NFUlZFUl9FTU9KSV9MSVNUX1JPV19FTlRSWSA9ICc8ZGl2IGNsYXNzPVwiZW1vamktaXRlbVwiPjwvZGl2PicgLy8gbWF4IDEwIHBlciByb3dcclxuXHJcbm1vZHVsZS5leHBvcnRzLlJFQUNUSU9OX1BPUE9VVF9SRUdFWCA9IC9UT0dHTEVfUkVBQ1RJT05fUE9QT1VUXyhcXGQrKS9cclxubW9kdWxlLmV4cG9ydHMuQ1VSUkVOVF9TRUxFQ1RFRF9DSEFOTkVMX1JFR0VYID0gLy4qXFwvLitcXC8oXFxkKykvXHJcbm1vZHVsZS5leHBvcnRzLklTX0lOQk9YX1JFR0VYID0gL1xcL2NoYW5uZWxzXFwvQG1lXFwvXFxkKy9cclxuXHJcbm1vZHVsZS5leHBvcnRzLklTX05VTUJFUl9SRUdFWCA9IC9cXGQrL1xyXG4iLCJjb25zdCBpZCA9IFN5bWJvbCgnaWQnKVxyXG5jb25zdCBuYW1lID0gU3ltYm9sKCduYW1lJylcclxuY29uc3QgdXJsID0gU3ltYm9sKCd1cmwnKVxyXG5jb25zdCBtYW5hZ2VkID0gU3ltYm9sKCdtYW5hZ2VkJylcclxuY29uc3QgcmVxdWlyZUNvbG9ucyA9IFN5bWJvbCgncmVxdWlyZUNvbG9ucycpXHJcbmNvbnN0IHJvbGVzID0gU3ltYm9sKCdyb2xlcycpXHJcblxyXG5jbGFzcyBFbW9qaSB7XHJcbiAgY29uc3RydWN0b3IgKF9pZCwgX25hbWUsIF9tYW5hZ2VkID0gZmFsc2UsIF9yZXF1aXJlQ29sb25zID0gdHJ1ZSwgX3JvbGVzID0gW10sIF91cmwgPSBgaHR0cHM6Ly9jZG4uZGlzY29yZGFwcC5jb20vZW1vamlzLyR7X2lkfS5wbmdgKSB7XHJcbiAgICB0aGlzW2lkXSA9IF9pZFxyXG4gICAgdGhpc1tuYW1lXSA9IF9uYW1lXHJcbiAgICB0aGlzW3VybF0gPSBfdXJsXHJcbiAgICB0aGlzW21hbmFnZWRdID0gX21hbmFnZWRcclxuICAgIHRoaXNbcmVxdWlyZUNvbG9uc10gPSBfcmVxdWlyZUNvbG9uc1xyXG4gICAgdGhpc1tyb2xlc10gPSBfcm9sZXNcclxuICB9XHJcblxyXG4gIGdldCBpZCAoKSB7XHJcbiAgICByZXR1cm4gdGhpc1tpZF1cclxuICB9XHJcblxyXG4gIGdldCBuYW1lICgpIHtcclxuICAgIHJldHVybiB0aGlzW25hbWVdXHJcbiAgfVxyXG5cclxuICBnZXQgdXJsICgpIHtcclxuICAgIHJldHVybiB0aGlzW3VybF1cclxuICB9XHJcblxyXG4gIGdldCBpc01hbmFnZWQgKCkge1xyXG4gICAgcmV0dXJuIHRoaXNbbWFuYWdlZF1cclxuICB9XHJcblxyXG4gIGdldCBjb2xvbnNSZXF1aXJlZCAoKSB7XHJcbiAgICByZXR1cm4gdGhpc1tyZXF1aXJlQ29sb25zXVxyXG4gIH1cclxuXHJcbiAgZ2V0IHJvbGVzICgpIHtcclxuICAgIHJldHVybiB0aGlzW3JvbGVzXVxyXG4gIH1cclxuXHJcbiAgZ2V0IHVzZU5hbWUgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29sb25zUmVxdWlyZWQgPyBgOiR7dGhpcy5uYW1lfTpgIDogdGhpcy5uYW1lXHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZnJvbVJhdyAoZW1vamlSYXcpIHtcclxuICAgIHJldHVybiBuZXcgRW1vamkoZW1vamlSYXcuaWQsIGVtb2ppUmF3Lm5hbWUsIGVtb2ppUmF3Lm1hbmFnZWQsIGVtb2ppUmF3LnJlcXVpcmVDb2xvbnMsIGVtb2ppUmF3LnJvbGVzKVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbW9qaVxyXG4iLCJjb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuL3NlcnZlci5qcycpXHJcbmNvbnN0IEVtb2ppID0gcmVxdWlyZSgnLi9lbW9qaS5qcycpXHJcbmNvbnN0IENvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJylcclxuY29uc3QgUGlja2VyID0gcmVxdWlyZSgnLi9waWNrZXIuanMnKVxyXG5cclxubGV0IE1ZX0lEID0gJydcclxuXHJcbmZ1bmN0aW9uIGdldFNlcnZlcnMgKCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICAnYXN5bmMnOiB0cnVlLFxyXG4gICAgICAndXJsJzogYCR7Q29uc3RhbnRzLkFQSV9CQVNFfS91c2Vycy9AbWUvZ3VpbGRzYCxcclxuICAgICAgJ21ldGhvZCc6ICdHRVQnXHJcbiAgICB9KVxyXG4gICAgLnRoZW4ocmVzID0+IHJlc29sdmUocmVzKSlcclxuICAgIC5mYWlsKGVyciA9PiByZWplY3QoZXJyKSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNeUlkICgpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgJ2FzeW5jJzogdHJ1ZSxcclxuICAgICAgJ3VybCc6IGAke0NvbnN0YW50cy5BUElfQkFTRX0vdXNlcnMvQG1lYCxcclxuICAgICAgJ21ldGhvZCc6ICdHRVQnXHJcbiAgICB9KVxyXG4gICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICBNWV9JRCA9IHJlc3BvbnNlLmlkXHJcbiAgICB9KVxyXG4gICAgLnRoZW4ocmVzID0+IHJlc29sdmUocmVzKSlcclxuICAgIC5mYWlsKGVyciA9PiByZWplY3QoZXJyKSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZVNlcnZlciAoc2VydmVyKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICQuYWpheCh7XHJcbiAgICAgICdhc3luYyc6IHRydWUsXHJcbiAgICAgICd1cmwnOiBgJHtDb25zdGFudHMuQVBJX0JBU0V9L2d1aWxkcy8ke3NlcnZlci5pZH0vbWVtYmVycy8ke01ZX0lEfWAsXHJcbiAgICAgICdtZXRob2QnOiAnR0VUJ1xyXG4gICAgfSkuZG9uZShyZXNwb25zZSA9PiB7XHJcbiAgICAgIGNvbnN0IG15Um9sZXMgPSByZXNwb25zZS5yb2xlc1xyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgICdhc3luYyc6IHRydWUsXHJcbiAgICAgICAgJ3VybCc6IGAke0NvbnN0YW50cy5BUElfQkFTRX0vZ3VpbGRzLyR7c2VydmVyLmlkfWAsXHJcbiAgICAgICAgJ21ldGhvZCc6ICdHRVQnXHJcbiAgICAgIH0pLmRvbmUocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIC8vIG5vdyB3ZSBnb3QgZGV0YWlsZWQgaW5mbyBhYm91dCBzZXJ2ZXIuIGZpbGwgZW1vamkgYW5kIG1hbmFnZWQgZW1vamlzLlxyXG4gICAgICAgIC8vIGFsc28gc2V0IG5hbWVcclxuICAgICAgICBjb25zdCBzcnYgPSBuZXcgU2VydmVyKHJlc3BvbnNlLmlkLCByZXNwb25zZS5uYW1lLCBzZXJ2ZXIucGVybWlzc2lvbnMpXHJcblxyXG4gICAgICAgIHJlc3BvbnNlLmVtb2ppcy5mb3JFYWNoKGVtb2ppUmF3ID0+IHtcclxuICAgICAgICAgIC8vIGdldCBlbW9qaSByZXF1aXJlZCByb2xlc1xyXG4gICAgICAgICAgY29uc3QgZW1vamkgPSBFbW9qaS5mcm9tUmF3KGVtb2ppUmF3KVxyXG4gICAgICAgICAgY29uc3QgZVIgPSBlbW9qaS5yb2xlc1xyXG5cclxuICAgICAgICAgIGlmICghZVIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHNydi5hZGRFbW9qaShlbW9qaSlcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZm9yIChjb25zdCByIGluIGVSKSB7XHJcbiAgICAgICAgICAgIC8vIHdlIGhhdmUgcmVxdWlyZWQgcm9sZVxyXG4gICAgICAgICAgICBpZiAobXlSb2xlcy5pbmNsdWRlcyhyKSkge1xyXG4gICAgICAgICAgICAgIHNydi5hZGRFbW9qaShlbW9qaSlcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXNvbHZlKHNydilcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VTZXJ2ZXJzIChzZXJ2ZXJzQSkge1xyXG4gIHJldHVybiBQcm9taXNlLmFsbChzZXJ2ZXJzQS5tYXAoc3J2ID0+IHBhcnNlU2VydmVyKHNydikpKVxyXG59XHJcblxyXG5mdW5jdGlvbiBsb2FkU3RhbmRhcnRFbW9qaXMgKCkge1xyXG4gIGxldCBjb21tb25FbW9qaXMgPSBbXVxyXG5cclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY29uc3QgdHJhbnNsYXRpb24gPSBDb25zdGFudHMuVFJBTlNMQVRJT05fTU9EVUxFLk1lc3NhZ2VzXHJcbiAgICBjb25zdCBjYXRlZ29yaWVzID0gQ29uc3RhbnRzLkVNT0pJX1NUT1JBR0VfTU9EVUxFLmdldENhdGVnb3JpZXMoKVxyXG4gICAgbGV0IGNvbW1vbkVtb2ppc1NwYW5zQ2FjaGVTcGFuID0gJCgnPHNwYW4+PC9zcGFuPicpXHJcblxyXG4gICAgZm9yIChsZXQgY2F0ZWdvcnkgb2YgY2F0ZWdvcmllcykge1xyXG4gICAgICBjb25zdCB0ciA9IHRyYW5zbGF0aW9uW2BFTU9KSV9DQVRFR09SWV8ke2NhdGVnb3J5LnRvVXBwZXJDYXNlKCl9YF1cclxuICAgICAgY29uc3QgZmFrZVNlcnZlciA9IG5ldyBTZXJ2ZXIodHIsIHRyLCAweDAwMDQwMDAwKVxyXG5cclxuICAgICAgY29uc3QgZW1vamlzID0gQ29uc3RhbnRzLkVNT0pJX1NUT1JBR0VfTU9EVUxFLmdldEJ5Q2F0ZWdvcnkoY2F0ZWdvcnkpXHJcblxyXG4gICAgICBmb3IgKGxldCBlbW9qaSBvZiBlbW9qaXMpIHtcclxuICAgICAgICBmYWtlU2VydmVyLmFkZEVtb2ppKG5ldyBFbW9qaShlbW9qaS5pbmRleCwgZW1vamkudW5pcXVlTmFtZSwgZW1vamkubWFuYWdlZCwgZW1vamkuYWxsTmFtZXNTdHJpbmcuaW5jbHVkZXMoJzonKSwgW10sIGVtb2ppLmRlZmF1bHRVcmwpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb21tb25FbW9qaXMucHVzaChmYWtlU2VydmVyKVxyXG4gICAgICBjb21tb25FbW9qaXNTcGFuc0NhY2hlU3Bhbi5hcHBlbmQoUGlja2VyLmJ1aWxkU2VydmVyU3BhbihmYWtlU2VydmVyKSlcclxuICAgIH1cclxuXHJcbiAgICByZXNvbHZlKHtlbW9qaXM6IGNvbW1vbkVtb2ppcywgc3BhbkNhY2hlOiBjb21tb25FbW9qaXNTcGFuc0NhY2hlU3Bhbi5odG1sKCl9KVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRvR2V0RW1vamlzICgpIHtcclxuICBjb25zdCB0b2tlbiA9IENvbnN0YW50cy5MT0NBTF9TVE9SQUdFX01PRFVMRS5pbXBsLmdldChDb25zdGFudHMuVE9LRU5fS0VZKVxyXG5cclxuICAkLmFqYXhTZXR1cCh7XHJcbiAgICAnY3Jvc3NEb21haW4nOiB0cnVlLFxyXG4gICAgJ2hlYWRlcnMnOiB7ICdhdXRob3JpemF0aW9uJzogdG9rZW4gfVxyXG4gIH0pXHJcblxyXG4gIHJldHVybiBnZXRNeUlkKClcclxuICAgIC50aGVuKGdldFNlcnZlcnMpXHJcbiAgICAudGhlbihwYXJzZVNlcnZlcnMpXHJcbiAgICAudGhlbihsb2FkU3RhbmRhcnRFbW9qaXMpXHJcbiAgICAuY2F0Y2goZSA9PiB7IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluaXRpYWxpemluZyBCZXR0ZXIgRW1vamlzIVxcblByb2JhYmx5IG1vZHVsZXMgb3JkZXIgaGFzIGJlZW4gY2hhbmdlZFxcbicsIGUpIH0pXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZG9HZXRFbW9qaXNcclxuIiwiLyohIENsdXN0ZXJpemUuanMgLSB2MC4xNy42IC0gMjAxNy0wMy0wNVxyXG4qIGh0dHA6Ly9OZVhUcy5naXRodWIuY29tL0NsdXN0ZXJpemUuanMvXHJcbiogQ29weXJpZ2h0IChjKSAyMDE1IERlbmlzIEx1a292OyBMaWNlbnNlZCBHUEx2MyAqL1xyXG5cclxuOyhmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xyXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcclxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JykgZGVmaW5lKGRlZmluaXRpb24pXHJcbiAgZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpXHJcbn0oJ0NsdXN0ZXJpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnXHJcblxyXG4gIC8vIGRldGVjdCBpZTkgYW5kIGxvd2VyXHJcbiAgLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGFkb2xzZXkvNTI3NjgzI2NvbW1lbnQtNzg2NjgyXHJcbiAgdmFyIGllID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgZm9yICh2YXIgdiA9IDMsXHJcbiAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdiJyksXHJcbiAgICAgICAgYWxsID0gZWwuYWxsIHx8IFtdO1xyXG4gICAgICAgICBlbC5pbm5lckhUTUwgPSAnPCEtLVtpZiBndCBJRSAnICsgKCsrdikgKyAnXT48aT48IVtlbmRpZl0tLT4nLFxyXG4gICAgICAgICBhbGxbMF07XHJcbiAgICAgICApIHt9XHJcbiAgICAgIHJldHVybiB2ID4gNCA/IHYgOiBkb2N1bWVudC5kb2N1bWVudE1vZGVcclxuICAgIH0oKSksXHJcbiAgICBpc19tYWMgPSBuYXZpZ2F0b3IucGxhdGZvcm0udG9Mb3dlckNhc2UoKS5pbmRleE9mKCdtYWMnKSArIDFcclxuICB2YXIgQ2x1c3Rlcml6ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQ2x1c3Rlcml6ZSkpIHsgcmV0dXJuIG5ldyBDbHVzdGVyaXplKGRhdGEpIH1cclxuICAgIHZhciBzZWxmID0gdGhpc1xyXG5cclxuICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgcm93c19pbl9ibG9jazogNTAsXHJcbiAgICAgIGJsb2Nrc19pbl9jbHVzdGVyOiA0LFxyXG4gICAgICB0YWc6IG51bGwsXHJcbiAgICAgIHNob3dfbm9fZGF0YV9yb3c6IHRydWUsXHJcbiAgICAgIG5vX2RhdGFfY2xhc3M6ICdjbHVzdGVyaXplLW5vLWRhdGEnLFxyXG4gICAgICBub19kYXRhX3RleHQ6ICdObyBkYXRhJyxcclxuICAgICAga2VlcF9wYXJpdHk6IHRydWUsXHJcbiAgICAgIGNhbGxiYWNrczoge31cclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgcGFyYW1ldGVyc1xyXG4gICAgc2VsZi5vcHRpb25zID0ge31cclxuICAgIHZhciBvcHRpb25zID0gWydyb3dzX2luX2Jsb2NrJywgJ2Jsb2Nrc19pbl9jbHVzdGVyJywgJ3Nob3dfbm9fZGF0YV9yb3cnLCAnbm9fZGF0YV9jbGFzcycsICdub19kYXRhX3RleHQnLCAna2VlcF9wYXJpdHknLCAndGFnJywgJ2NhbGxiYWNrcyddXHJcbiAgICBmb3IgKHZhciBpID0gMCwgb3B0aW9uOyBvcHRpb24gPSBvcHRpb25zW2ldOyBpKyspIHtcclxuICAgICAgc2VsZi5vcHRpb25zW29wdGlvbl0gPSB0eXBlb2YgZGF0YVtvcHRpb25dICE9PSAndW5kZWZpbmVkJyAmJiBkYXRhW29wdGlvbl0gIT0gbnVsbFxyXG4gICAgICAgID8gZGF0YVtvcHRpb25dXHJcbiAgICAgICAgOiBkZWZhdWx0c1tvcHRpb25dXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGVsZW1zID0gWydzY3JvbGwnLCAnY29udGVudCddXHJcbiAgICBmb3IgKHZhciBpID0gMCwgZWxlbTsgZWxlbSA9IGVsZW1zW2ldOyBpKyspIHtcclxuICAgICAgc2VsZltlbGVtICsgJ19lbGVtJ10gPSBkYXRhW2VsZW0gKyAnSWQnXVxyXG4gICAgICAgID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YVtlbGVtICsgJ0lkJ10pXHJcbiAgICAgICAgOiBkYXRhW2VsZW0gKyAnRWxlbSddXHJcbiAgICAgIGlmICghc2VsZltlbGVtICsgJ19lbGVtJ10pIHsgdGhyb3cgbmV3IEVycm9yKCdFcnJvciEgQ291bGQgbm90IGZpbmQgJyArIGVsZW0gKyAnIGVsZW1lbnQnKSB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdGFiaW5kZXggZm9yY2VzIHRoZSBicm93c2VyIHRvIGtlZXAgZm9jdXMgb24gdGhlIHNjcm9sbGluZyBsaXN0LCBmaXhlcyAjMTFcclxuICAgIGlmICghc2VsZi5jb250ZW50X2VsZW0uaGFzQXR0cmlidXRlKCd0YWJpbmRleCcpKSB7IHNlbGYuY29udGVudF9lbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKSB9XHJcblxyXG4gICAgLy8gcHJpdmF0ZSBwYXJhbWV0ZXJzXHJcbiAgICB2YXIgcm93cyA9IGlzQXJyYXkoZGF0YS5yb3dzKVxyXG4gICAgICAgID8gZGF0YS5yb3dzXHJcbiAgICAgICAgOiBzZWxmLmZldGNoTWFya3VwKCksXHJcbiAgICAgIGNhY2hlID0ge30sXHJcbiAgICAgIHNjcm9sbF90b3AgPSBzZWxmLnNjcm9sbF9lbGVtLnNjcm9sbFRvcFxyXG5cclxuICAgIC8vIGFwcGVuZCBpbml0aWFsIGRhdGFcclxuICAgIHNlbGYuaW5zZXJ0VG9ET00ocm93cywgY2FjaGUpXHJcblxyXG4gICAgLy8gcmVzdG9yZSB0aGUgc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICBzZWxmLnNjcm9sbF9lbGVtLnNjcm9sbFRvcCA9IHNjcm9sbF90b3BcclxuXHJcbiAgICAvLyBhZGRpbmcgc2Nyb2xsIGhhbmRsZXJcclxuICAgIHZhciBsYXN0X2NsdXN0ZXIgPSBmYWxzZSxcclxuICAgICAgc2Nyb2xsX2RlYm91bmNlID0gMCxcclxuICAgICAgcG9pbnRlcl9ldmVudHNfc2V0ID0gZmFsc2UsXHJcbiAgICAgIHNjcm9sbEV2ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBmaXhlcyBzY3JvbGxpbmcgaXNzdWUgb24gTWFjICMzXHJcbiAgICAgICAgaWYgKGlzX21hYykge1xyXG4gICAgICAgICAgaWYgKCFwb2ludGVyX2V2ZW50c19zZXQpIHNlbGYuY29udGVudF9lbGVtLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSdcclxuICAgICAgICAgIHBvaW50ZXJfZXZlbnRzX3NldCA9IHRydWVcclxuICAgICAgICAgIGNsZWFyVGltZW91dChzY3JvbGxfZGVib3VuY2UpXHJcbiAgICAgICAgICBzY3JvbGxfZGVib3VuY2UgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5jb250ZW50X2VsZW0uc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJ1xyXG4gICAgICAgICAgICBwb2ludGVyX2V2ZW50c19zZXQgPSBmYWxzZVxyXG4gICAgICAgICAgfSwgNTApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsYXN0X2NsdXN0ZXIgIT0gKGxhc3RfY2x1c3RlciA9IHNlbGYuZ2V0Q2x1c3Rlck51bSgpKSkgeyBzZWxmLmluc2VydFRvRE9NKHJvd3MsIGNhY2hlKSB9XHJcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5jYWxsYmFja3Muc2Nyb2xsaW5nUHJvZ3Jlc3MpIHsgc2VsZi5vcHRpb25zLmNhbGxiYWNrcy5zY3JvbGxpbmdQcm9ncmVzcyhzZWxmLmdldFNjcm9sbFByb2dyZXNzKCkpIH1cclxuICAgICAgfSxcclxuICAgICAgcmVzaXplX2RlYm91bmNlID0gMCxcclxuICAgICAgcmVzaXplRXYgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHJlc2l6ZV9kZWJvdW5jZSlcclxuICAgICAgICByZXNpemVfZGVib3VuY2UgPSBzZXRUaW1lb3V0KHNlbGYucmVmcmVzaCwgMTAwKVxyXG4gICAgICB9XHJcbiAgICBvbignc2Nyb2xsJywgc2VsZi5zY3JvbGxfZWxlbSwgc2Nyb2xsRXYpXHJcbiAgICBvbigncmVzaXplJywgd2luZG93LCByZXNpemVFdilcclxuXHJcbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG4gICAgc2VsZi5kZXN0cm95ID0gZnVuY3Rpb24gKGNsZWFuKSB7XHJcbiAgICAgIG9mZignc2Nyb2xsJywgc2VsZi5zY3JvbGxfZWxlbSwgc2Nyb2xsRXYpXHJcbiAgICAgIG9mZigncmVzaXplJywgd2luZG93LCByZXNpemVFdilcclxuICAgICAgc2VsZi5odG1sKChjbGVhbiA/IHNlbGYuZ2VuZXJhdGVFbXB0eVJvdygpIDogcm93cykuam9pbignJykpXHJcbiAgICB9XHJcbiAgICBzZWxmLnJlZnJlc2ggPSBmdW5jdGlvbiAoZm9yY2UpIHtcclxuICAgICAgaWYgKHNlbGYuZ2V0Um93c0hlaWdodChyb3dzKSB8fCBmb3JjZSkgc2VsZi51cGRhdGUocm93cylcclxuICAgIH1cclxuICAgIHNlbGYudXBkYXRlID0gZnVuY3Rpb24gKG5ld19yb3dzKSB7XHJcbiAgICAgIHJvd3MgPSBpc0FycmF5KG5ld19yb3dzKVxyXG4gICAgICAgID8gbmV3X3Jvd3NcclxuICAgICAgICA6IFtdXHJcbiAgICAgIHZhciBzY3JvbGxfdG9wID0gc2VsZi5zY3JvbGxfZWxlbS5zY3JvbGxUb3BcclxuICAgICAgLy8gZml4ZXMgIzM5XHJcbiAgICAgIGlmIChyb3dzLmxlbmd0aCAqIHNlbGYub3B0aW9ucy5pdGVtX2hlaWdodCA8IHNjcm9sbF90b3ApIHtcclxuICAgICAgICBzZWxmLnNjcm9sbF9lbGVtLnNjcm9sbFRvcCA9IDBcclxuICAgICAgICBsYXN0X2NsdXN0ZXIgPSAwXHJcbiAgICAgIH1cclxuICAgICAgc2VsZi5pbnNlcnRUb0RPTShyb3dzLCBjYWNoZSlcclxuICAgICAgc2VsZi5zY3JvbGxfZWxlbS5zY3JvbGxUb3AgPSBzY3JvbGxfdG9wXHJcbiAgICB9XHJcbiAgICBzZWxmLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLnVwZGF0ZShbXSlcclxuICAgIH1cclxuICAgIHNlbGYuZ2V0Um93c0Ftb3VudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHJvd3MubGVuZ3RoXHJcbiAgICB9XHJcbiAgICBzZWxmLmdldFNjcm9sbFByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnNjcm9sbF90b3AgLyAocm93cy5sZW5ndGggKiB0aGlzLm9wdGlvbnMuaXRlbV9oZWlnaHQpICogMTAwIHx8IDBcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYWRkID0gZnVuY3Rpb24gKHdoZXJlLCBfbmV3X3Jvd3MpIHtcclxuICAgICAgdmFyIG5ld19yb3dzID0gaXNBcnJheShfbmV3X3Jvd3MpXHJcbiAgICAgICAgPyBfbmV3X3Jvd3NcclxuICAgICAgICA6IFtdXHJcbiAgICAgIGlmICghbmV3X3Jvd3MubGVuZ3RoKSByZXR1cm5cclxuICAgICAgcm93cyA9IHdoZXJlID09ICdhcHBlbmQnXHJcbiAgICAgICAgPyByb3dzLmNvbmNhdChuZXdfcm93cylcclxuICAgICAgICA6IG5ld19yb3dzLmNvbmNhdChyb3dzKVxyXG4gICAgICBzZWxmLmluc2VydFRvRE9NKHJvd3MsIGNhY2hlKVxyXG4gICAgfVxyXG4gICAgc2VsZi5hcHBlbmQgPSBmdW5jdGlvbiAocm93cykge1xyXG4gICAgICBhZGQoJ2FwcGVuZCcsIHJvd3MpXHJcbiAgICB9XHJcbiAgICBzZWxmLnByZXBlbmQgPSBmdW5jdGlvbiAocm93cykge1xyXG4gICAgICBhZGQoJ3ByZXBlbmQnLCByb3dzKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQ2x1c3Rlcml6ZS5wcm90b3R5cGUgPSB7XHJcbiAgICBjb25zdHJ1Y3RvcjogQ2x1c3Rlcml6ZSxcclxuICAgIC8vIGZldGNoIGV4aXN0aW5nIG1hcmt1cFxyXG4gICAgZmV0Y2hNYXJrdXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHJvd3MgPSBbXSwgcm93c19ub2RlcyA9IHRoaXMuZ2V0Q2hpbGROb2Rlcyh0aGlzLmNvbnRlbnRfZWxlbSlcclxuICAgICAgd2hpbGUgKHJvd3Nfbm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgcm93cy5wdXNoKHJvd3Nfbm9kZXMuc2hpZnQoKS5vdXRlckhUTUwpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJvd3NcclxuICAgIH0sXHJcbiAgICAvLyBnZXQgdGFnIG5hbWUsIGNvbnRlbnQgdGFnIG5hbWUsIHRhZyBoZWlnaHQsIGNhbGMgY2x1c3RlciBoZWlnaHRcclxuICAgIGV4cGxvcmVFbnZpcm9ubWVudDogZnVuY3Rpb24gKHJvd3MsIGNhY2hlKSB7XHJcbiAgICAgIHZhciBvcHRzID0gdGhpcy5vcHRpb25zXHJcbiAgICAgIG9wdHMuY29udGVudF90YWcgPSB0aGlzLmNvbnRlbnRfZWxlbS50YWdOYW1lLnRvTG93ZXJDYXNlKClcclxuICAgICAgaWYgKCFyb3dzLmxlbmd0aCkgcmV0dXJuXHJcbiAgICAgIGlmIChpZSAmJiBpZSA8PSA5ICYmICFvcHRzLnRhZykgb3B0cy50YWcgPSByb3dzWzBdLm1hdGNoKC88KFtePlxccy9dKikvKVsxXS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIGlmICh0aGlzLmNvbnRlbnRfZWxlbS5jaGlsZHJlbi5sZW5ndGggPD0gMSkgY2FjaGUuZGF0YSA9IHRoaXMuaHRtbChyb3dzWzBdICsgcm93c1swXSArIHJvd3NbMF0pXHJcbiAgICAgIGlmICghb3B0cy50YWcpIG9wdHMudGFnID0gdGhpcy5jb250ZW50X2VsZW0uY2hpbGRyZW5bMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIHRoaXMuZ2V0Um93c0hlaWdodChyb3dzKVxyXG4gICAgfSxcclxuICAgIGdldFJvd3NIZWlnaHQ6IGZ1bmN0aW9uIChyb3dzKSB7XHJcbiAgICAgIHZhciBvcHRzID0gdGhpcy5vcHRpb25zLFxyXG4gICAgICAgIHByZXZfaXRlbV9oZWlnaHQgPSBvcHRzLml0ZW1faGVpZ2h0XHJcbiAgICAgIG9wdHMuY2x1c3Rlcl9oZWlnaHQgPSAwXHJcbiAgICAgIGlmICghcm93cy5sZW5ndGgpIHJldHVyblxyXG4gICAgICB2YXIgbm9kZXMgPSB0aGlzLmNvbnRlbnRfZWxlbS5jaGlsZHJlblxyXG4gICAgICB2YXIgbm9kZSA9IG5vZGVzW01hdGguZmxvb3Iobm9kZXMubGVuZ3RoIC8gMildXHJcbiAgICAgIG9wdHMuaXRlbV9oZWlnaHQgPSBub2RlLm9mZnNldEhlaWdodFxyXG4gICAgICAvLyBjb25zaWRlciB0YWJsZSdzIGJvcmRlci1zcGFjaW5nXHJcbiAgICAgIGlmIChvcHRzLnRhZyA9PSAndHInICYmIGdldFN0eWxlKCdib3JkZXJDb2xsYXBzZScsIHRoaXMuY29udGVudF9lbGVtKSAhPSAnY29sbGFwc2UnKSB7IG9wdHMuaXRlbV9oZWlnaHQgKz0gcGFyc2VJbnQoZ2V0U3R5bGUoJ2JvcmRlclNwYWNpbmcnLCB0aGlzLmNvbnRlbnRfZWxlbSksIDEwKSB8fCAwIH1cclxuICAgICAgLy8gY29uc2lkZXIgbWFyZ2lucyAoYW5kIG1hcmdpbnMgY29sbGFwc2luZylcclxuICAgICAgaWYgKG9wdHMudGFnICE9ICd0cicpIHtcclxuICAgICAgICB2YXIgbWFyZ2luVG9wID0gcGFyc2VJbnQoZ2V0U3R5bGUoJ21hcmdpblRvcCcsIG5vZGUpLCAxMCkgfHwgMFxyXG4gICAgICAgIHZhciBtYXJnaW5Cb3R0b20gPSBwYXJzZUludChnZXRTdHlsZSgnbWFyZ2luQm90dG9tJywgbm9kZSksIDEwKSB8fCAwXHJcbiAgICAgICAgb3B0cy5pdGVtX2hlaWdodCArPSBNYXRoLm1heChtYXJnaW5Ub3AsIG1hcmdpbkJvdHRvbSlcclxuICAgICAgfVxyXG4gICAgICBvcHRzLmJsb2NrX2hlaWdodCA9IG9wdHMuaXRlbV9oZWlnaHQgKiBvcHRzLnJvd3NfaW5fYmxvY2tcclxuICAgICAgb3B0cy5yb3dzX2luX2NsdXN0ZXIgPSBvcHRzLmJsb2Nrc19pbl9jbHVzdGVyICogb3B0cy5yb3dzX2luX2Jsb2NrXHJcbiAgICAgIG9wdHMuY2x1c3Rlcl9oZWlnaHQgPSBvcHRzLmJsb2Nrc19pbl9jbHVzdGVyICogb3B0cy5ibG9ja19oZWlnaHRcclxuICAgICAgcmV0dXJuIHByZXZfaXRlbV9oZWlnaHQgIT0gb3B0cy5pdGVtX2hlaWdodFxyXG4gICAgfSxcclxuICAgIC8vIGdldCBjdXJyZW50IGNsdXN0ZXIgbnVtYmVyXHJcbiAgICBnZXRDbHVzdGVyTnVtOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxfdG9wID0gdGhpcy5zY3JvbGxfZWxlbS5zY3JvbGxUb3BcclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy5vcHRpb25zLnNjcm9sbF90b3AgLyAodGhpcy5vcHRpb25zLmNsdXN0ZXJfaGVpZ2h0IC0gdGhpcy5vcHRpb25zLmJsb2NrX2hlaWdodCkpIHx8IDBcclxuICAgIH0sXHJcbiAgICAvLyBnZW5lcmF0ZSBlbXB0eSByb3cgaWYgbm8gZGF0YSBwcm92aWRlZFxyXG4gICAgZ2VuZXJhdGVFbXB0eVJvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgb3B0cyA9IHRoaXMub3B0aW9uc1xyXG4gICAgICBpZiAoIW9wdHMudGFnIHx8ICFvcHRzLnNob3dfbm9fZGF0YV9yb3cpIHJldHVybiBbXVxyXG4gICAgICB2YXIgZW1wdHlfcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHRzLnRhZyksXHJcbiAgICAgICAgbm9fZGF0YV9jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUob3B0cy5ub19kYXRhX3RleHQpLCB0ZFxyXG4gICAgICBlbXB0eV9yb3cuY2xhc3NOYW1lID0gb3B0cy5ub19kYXRhX2NsYXNzXHJcbiAgICAgIGlmIChvcHRzLnRhZyA9PSAndHInKSB7XHJcbiAgICAgICAgdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpXHJcbiAgICAgICAgLy8gZml4ZXMgIzUzXHJcbiAgICAgICAgdGQuY29sU3BhbiA9IDEwMFxyXG4gICAgICAgIHRkLmFwcGVuZENoaWxkKG5vX2RhdGFfY29udGVudClcclxuICAgICAgfVxyXG4gICAgICBlbXB0eV9yb3cuYXBwZW5kQ2hpbGQodGQgfHwgbm9fZGF0YV9jb250ZW50KVxyXG4gICAgICByZXR1cm4gW2VtcHR5X3Jvdy5vdXRlckhUTUxdXHJcbiAgICB9LFxyXG4gICAgLy8gZ2VuZXJhdGUgY2x1c3RlciBmb3IgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cclxuICAgIGdlbmVyYXRlOiBmdW5jdGlvbiAocm93cywgY2x1c3Rlcl9udW0pIHtcclxuICAgICAgdmFyIG9wdHMgPSB0aGlzLm9wdGlvbnMsXHJcbiAgICAgICAgcm93c19sZW4gPSByb3dzLmxlbmd0aFxyXG4gICAgICBpZiAocm93c19sZW4gPCBvcHRzLnJvd3NfaW5fYmxvY2spIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdG9wX29mZnNldDogMCxcclxuICAgICAgICAgIGJvdHRvbV9vZmZzZXQ6IDAsXHJcbiAgICAgICAgICByb3dzX2Fib3ZlOiAwLFxyXG4gICAgICAgICAgcm93czogcm93c19sZW4gPyByb3dzIDogdGhpcy5nZW5lcmF0ZUVtcHR5Um93KClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGl0ZW1zX3N0YXJ0ID0gTWF0aC5tYXgoKG9wdHMucm93c19pbl9jbHVzdGVyIC0gb3B0cy5yb3dzX2luX2Jsb2NrKSAqIGNsdXN0ZXJfbnVtLCAwKSxcclxuICAgICAgICBpdGVtc19lbmQgPSBpdGVtc19zdGFydCArIG9wdHMucm93c19pbl9jbHVzdGVyLFxyXG4gICAgICAgIHRvcF9vZmZzZXQgPSBNYXRoLm1heChpdGVtc19zdGFydCAqIG9wdHMuaXRlbV9oZWlnaHQsIDApLFxyXG4gICAgICAgIGJvdHRvbV9vZmZzZXQgPSBNYXRoLm1heCgocm93c19sZW4gLSBpdGVtc19lbmQpICogb3B0cy5pdGVtX2hlaWdodCwgMCksXHJcbiAgICAgICAgdGhpc19jbHVzdGVyX3Jvd3MgPSBbXSxcclxuICAgICAgICByb3dzX2Fib3ZlID0gaXRlbXNfc3RhcnRcclxuICAgICAgaWYgKHRvcF9vZmZzZXQgPCAxKSB7XHJcbiAgICAgICAgcm93c19hYm92ZSsrXHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgaSA9IGl0ZW1zX3N0YXJ0OyBpIDwgaXRlbXNfZW5kOyBpKyspIHtcclxuICAgICAgICByb3dzW2ldICYmIHRoaXNfY2x1c3Rlcl9yb3dzLnB1c2gocm93c1tpXSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHRvcF9vZmZzZXQ6IHRvcF9vZmZzZXQsXHJcbiAgICAgICAgYm90dG9tX29mZnNldDogYm90dG9tX29mZnNldCxcclxuICAgICAgICByb3dzX2Fib3ZlOiByb3dzX2Fib3ZlLFxyXG4gICAgICAgIHJvd3M6IHRoaXNfY2x1c3Rlcl9yb3dzXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZW5kZXJFeHRyYVRhZzogZnVuY3Rpb24gKGNsYXNzX25hbWUsIGhlaWdodCkge1xyXG4gICAgICB2YXIgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLm9wdGlvbnMudGFnKSxcclxuICAgICAgICBjbHVzdGVyaXplX3ByZWZpeCA9ICdjbHVzdGVyaXplLSdcclxuICAgICAgdGFnLmNsYXNzTmFtZSA9IFtjbHVzdGVyaXplX3ByZWZpeCArICdleHRyYS1yb3cnLCBjbHVzdGVyaXplX3ByZWZpeCArIGNsYXNzX25hbWVdLmpvaW4oJyAnKVxyXG4gICAgICBoZWlnaHQgJiYgKHRhZy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnKVxyXG4gICAgICByZXR1cm4gdGFnLm91dGVySFRNTFxyXG4gICAgfSxcclxuICAgIC8vIGlmIG5lY2Vzc2FyeSB2ZXJpZnkgZGF0YSBjaGFuZ2VkIGFuZCBpbnNlcnQgdG8gRE9NXHJcbiAgICBpbnNlcnRUb0RPTTogZnVuY3Rpb24gKHJvd3MsIGNhY2hlKSB7XHJcbiAgICAgIC8vIGV4cGxvcmUgcm93J3MgaGVpZ2h0XHJcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmNsdXN0ZXJfaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5leHBsb3JlRW52aXJvbm1lbnQocm93cywgY2FjaGUpXHJcbiAgICAgIH1cclxuICAgICAgdmFyIGRhdGEgPSB0aGlzLmdlbmVyYXRlKHJvd3MsIHRoaXMuZ2V0Q2x1c3Rlck51bSgpKSxcclxuICAgICAgICB0aGlzX2NsdXN0ZXJfcm93cyA9IGRhdGEucm93cy5qb2luKCcnKSxcclxuICAgICAgICB0aGlzX2NsdXN0ZXJfY29udGVudF9jaGFuZ2VkID0gdGhpcy5jaGVja0NoYW5nZXMoJ2RhdGEnLCB0aGlzX2NsdXN0ZXJfcm93cywgY2FjaGUpLFxyXG4gICAgICAgIHRvcF9vZmZzZXRfY2hhbmdlZCA9IHRoaXMuY2hlY2tDaGFuZ2VzKCd0b3AnLCBkYXRhLnRvcF9vZmZzZXQsIGNhY2hlKSxcclxuICAgICAgICBvbmx5X2JvdHRvbV9vZmZzZXRfY2hhbmdlZCA9IHRoaXMuY2hlY2tDaGFuZ2VzKCdib3R0b20nLCBkYXRhLmJvdHRvbV9vZmZzZXQsIGNhY2hlKSxcclxuICAgICAgICBjYWxsYmFja3MgPSB0aGlzLm9wdGlvbnMuY2FsbGJhY2tzLFxyXG4gICAgICAgIGxheW91dCA9IFtdXHJcblxyXG4gICAgICBpZiAodGhpc19jbHVzdGVyX2NvbnRlbnRfY2hhbmdlZCB8fCB0b3Bfb2Zmc2V0X2NoYW5nZWQpIHtcclxuICAgICAgICBpZiAoZGF0YS50b3Bfb2Zmc2V0KSB7XHJcbiAgICAgICAgICB0aGlzLm9wdGlvbnMua2VlcF9wYXJpdHkgJiYgbGF5b3V0LnB1c2godGhpcy5yZW5kZXJFeHRyYVRhZygna2VlcC1wYXJpdHknKSlcclxuICAgICAgICAgIGxheW91dC5wdXNoKHRoaXMucmVuZGVyRXh0cmFUYWcoJ3RvcC1zcGFjZScsIGRhdGEudG9wX29mZnNldCkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxheW91dC5wdXNoKHRoaXNfY2x1c3Rlcl9yb3dzKVxyXG4gICAgICAgIGRhdGEuYm90dG9tX29mZnNldCAmJiBsYXlvdXQucHVzaCh0aGlzLnJlbmRlckV4dHJhVGFnKCdib3R0b20tc3BhY2UnLCBkYXRhLmJvdHRvbV9vZmZzZXQpKVxyXG4gICAgICAgIGNhbGxiYWNrcy5jbHVzdGVyV2lsbENoYW5nZSAmJiBjYWxsYmFja3MuY2x1c3RlcldpbGxDaGFuZ2UoKVxyXG4gICAgICAgIHRoaXMuaHRtbChsYXlvdXQuam9pbignJykpXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmNvbnRlbnRfdGFnID09ICdvbCcgJiYgdGhpcy5jb250ZW50X2VsZW0uc2V0QXR0cmlidXRlKCdzdGFydCcsIGRhdGEucm93c19hYm92ZSlcclxuICAgICAgICBjYWxsYmFja3MuY2x1c3RlckNoYW5nZWQgJiYgY2FsbGJhY2tzLmNsdXN0ZXJDaGFuZ2VkKClcclxuICAgICAgfSBlbHNlIGlmIChvbmx5X2JvdHRvbV9vZmZzZXRfY2hhbmdlZCkge1xyXG4gICAgICAgIHRoaXMuY29udGVudF9lbGVtLmxhc3RDaGlsZC5zdHlsZS5oZWlnaHQgPSBkYXRhLmJvdHRvbV9vZmZzZXQgKyAncHgnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyB1bmZvcnR1bmF0ZWx5IGllIDw9IDkgZG9lcyBub3QgYWxsb3cgdG8gdXNlIGlubmVySFRNTCBmb3IgdGFibGUgZWxlbWVudHMsIHNvIG1ha2UgYSB3b3JrYXJvdW5kXHJcbiAgICBodG1sOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICB2YXIgY29udGVudF9lbGVtID0gdGhpcy5jb250ZW50X2VsZW1cclxuICAgICAgaWYgKGllICYmIGllIDw9IDkgJiYgdGhpcy5vcHRpb25zLnRhZyA9PSAndHInKSB7XHJcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBsYXN0XHJcbiAgICAgICAgZGl2LmlubmVySFRNTCA9ICc8dGFibGU+PHRib2R5PicgKyBkYXRhICsgJzwvdGJvZHk+PC90YWJsZT4nXHJcbiAgICAgICAgd2hpbGUgKChsYXN0ID0gY29udGVudF9lbGVtLmxhc3RDaGlsZCkpIHtcclxuICAgICAgICAgIGNvbnRlbnRfZWxlbS5yZW1vdmVDaGlsZChsYXN0KVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm93c19ub2RlcyA9IHRoaXMuZ2V0Q2hpbGROb2RlcyhkaXYuZmlyc3RDaGlsZC5maXJzdENoaWxkKVxyXG4gICAgICAgIHdoaWxlIChyb3dzX25vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgY29udGVudF9lbGVtLmFwcGVuZENoaWxkKHJvd3Nfbm9kZXMuc2hpZnQoKSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29udGVudF9lbGVtLmlubmVySFRNTCA9IGRhdGFcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldENoaWxkTm9kZXM6IGZ1bmN0aW9uICh0YWcpIHtcclxuICAgICAgdmFyIGNoaWxkX25vZGVzID0gdGFnLmNoaWxkcmVuLCBub2RlcyA9IFtdXHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGNoaWxkX25vZGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICBub2Rlcy5wdXNoKGNoaWxkX25vZGVzW2ldKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBub2Rlc1xyXG4gICAgfSxcclxuICAgIGNoZWNrQ2hhbmdlczogZnVuY3Rpb24gKHR5cGUsIHZhbHVlLCBjYWNoZSkge1xyXG4gICAgICB2YXIgY2hhbmdlZCA9IHZhbHVlICE9IGNhY2hlW3R5cGVdXHJcbiAgICAgIGNhY2hlW3R5cGVdID0gdmFsdWVcclxuICAgICAgcmV0dXJuIGNoYW5nZWRcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHN1cHBvcnQgZnVuY3Rpb25zXHJcbiAgZnVuY3Rpb24gb24gKGV2dCwgZWxlbWVudCwgZm5jKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyID8gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2dCwgZm5jLCBmYWxzZSkgOiBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldnQsIGZuYylcclxuICB9XHJcbiAgZnVuY3Rpb24gb2ZmIChldnQsIGVsZW1lbnQsIGZuYykge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciA/IGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnQsIGZuYywgZmFsc2UpIDogZWxlbWVudC5kZXRhY2hFdmVudCgnb24nICsgZXZ0LCBmbmMpXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGlzQXJyYXkgKGFycikge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nXHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGdldFN0eWxlIChwcm9wLCBlbGVtKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUgPyB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKVtwcm9wXSA6IGVsZW0uY3VycmVudFN0eWxlW3Byb3BdXHJcbiAgfVxyXG5cclxuICByZXR1cm4gQ2x1c3Rlcml6ZVxyXG59KSlcclxuIiwiY29uc3QgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKVxyXG5jb25zdCBQaWNrZXIgPSByZXF1aXJlKCcuL3BpY2tlci5qcycpXHJcblxyXG5jb25zdCBpbml0RW1vamlzID0gcmVxdWlyZSgnLi9pbml0aWFsaXplci5qcycpXHJcblxyXG5mdW5jdGlvbiB3YXRjaEZvckVtb2ppUGlja2VyQ2hhbmdlIChsaXN0ZW5lcikge1xyXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobXV0YXRpb25zID0+IHtcclxuICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgbGlzdGVuZXIobXV0YXRpb25zKVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgb2JzZXJ2ZXIub2JzZXJ2ZSgkKENvbnN0YW50cy5FTU9KSV9QSUNLRVJfUEFUSClbMF0sIHsgY2hpbGRMaXN0OiB0cnVlIH0pXHJcbiAgcmV0dXJuIG9ic2VydmVyXHJcbn1cclxuXHJcbmluaXRFbW9qaXMoKS50aGVuKChzcGFuQ2FjaGUpID0+IHtcclxuICBQaWNrZXIuc2V0Q29tbW9uRW1vamlTcGFuQ2FjaGUoc3BhbkNhY2hlLnNwYW5DYWNoZSlcclxuICBjb25zb2xlLmxvZygnQmV0dGVyIEVtb2ppcyBpbml0aWFsaXplZCcpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICB3aW5kb3cuYmV0dGVyX2Vtb2ppcy5vYnNlcnZlciA9IHdhdGNoRm9yRW1vamlQaWNrZXJDaGFuZ2UoKFttdXRhdGlvbl0pID0+IHtcclxuICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XHJcbiAgICAgICAgaWYgKG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgaWYgKCQoQ29uc3RhbnRzLkVNT0pJX1BJQ0tFUl9QQVRIKS5maW5kKCcuZW1vamktcGlja2VyJykubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKCQoJy5jaGFubmVsLXRleHRhcmVhLWVtb2ppJykuaGFzQ2xhc3MoJ3BvcG91dC1vcGVuJykgfHwgJCgnLmJ0bi1yZWFjdGlvbi5wb3BvdXQtb3BlbicpLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgUGlja2VyLnNob3coKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobXV0YXRpb24ucmVtb3ZlZE5vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgaWYgKHdpbmRvdy5iZXR0ZXJfZW1vamlzLmN1cnJlbnRfY2x1c3Rlcikge1xyXG4gICAgICAgICAgICB3aW5kb3cuYmV0dGVyX2Vtb2ppcy5jdXJyZW50X2NsdXN0ZXIuZGVzdHJveSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH0sIDIwMDApXHJcbn0pXHJcbiIsImNvbnN0IENvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJylcclxuY29uc3QgQ2x1c3Rlcml6ZSA9IHJlcXVpcmUoJy4vbGliL2NsdXN0ZXJpemUuanMnKVxyXG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuL3NlcnZlci5qcycpXHJcblxyXG5sZXQgY29tbW9uRW1vamlzU3BhbnNDYWNoZSA9ICcnXHJcbmxldCBjdXJyZW50UGlja2VyRW1vamlSZWdpc3RyeSA9IFtdXHJcblxyXG5sZXQgU0NST0xMRVJfV1JBUCA9IG51bGxcclxubGV0IFNDUk9MTEVSX1dSQVBfT0xEID0gbnVsbFxyXG5sZXQgU0VBUkNIX0lOUFVUID0gbnVsbFxyXG5cclxuZnVuY3Rpb24gYnVpbGRTY3JvbGxlcldyYXAgKCkge1xyXG4gIGNvbnN0IHMgPSBTQ1JPTExFUl9XUkFQIHx8ICQoQ29uc3RhbnRzLkVMRU1FTlRfU0NST0xMRVJfV1JBUClcclxuICBjb25zdCBzY3IgPSBzLmZpbmQoJy5zY3JvbGxlcicpXHJcblxyXG4gIHNjci5odG1sKCcgJykub2ZmKCdjbGljaycpLm9mZignbW91c2VlbnRlcicpLm9mZignbW91c2VsZWF2ZScpXHJcbiAgY3VycmVudFBpY2tlckVtb2ppUmVnaXN0cnkubGVuZ3RoID0gMFxyXG5cclxuICBjb25zdCBjID0gU2VydmVyLmdldEN1cnJlbnRTZXJ2ZXIoKVxyXG4gICAgLy8gQXBwZW5kIGFsbCBjdXJyZW50IHNlcnZlciBlbW9qaXMsIGlmIGFueVxyXG4gIGlmIChjLmVtb2ppcy5sZW5ndGggPiAwKSB7IHNjci5hcHBlbmQoYnVpbGRTZXJ2ZXJTcGFuKGMpKSB9XHJcblxyXG4gICAgLy8gQXBwZW5kIGFsbCBvdGhlciBzZXJ2ZXIgc2hhcmVkIGVtb2ppc1xyXG4gIGlmIChjLmNhblVzZUV4dGVybmFsRW1vamlzKSB7XHJcbiAgICBmb3IgKGNvbnN0IHNlcnZlciBvZiBTZXJ2ZXIuZ2V0QWxsU2VydmVycygpKSB7XHJcbiAgICAgIGlmICghc2VydmVyLmlzQ3VycmVudCgpICYmIHNlcnZlci5zaGFyZWRFbW9qaXMubGVuZ3RoID4gMCAmJiBDb25zdGFudHMuSVNfTlVNQkVSX1JFR0VYLnRlc3Qoc2VydmVyLmlkKSkge1xyXG4gICAgICAgIHNjci5hcHBlbmQoYnVpbGRTZXJ2ZXJTcGFuKHNlcnZlcikpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gICAgLy8gQXBwZW5kIGNvbW1vbiBlbW9qaXNcclxuICBpZiAoY29tbW9uRW1vamlzU3BhbnNDYWNoZSkge1xyXG4gICAgc2NyLmFwcGVuZChjb21tb25FbW9qaXNTcGFuc0NhY2hlKVxyXG4gIH1cclxuXHJcbiAgd2luZG93LmJldHRlcl9lbW9qaXMuY3VycmVudF9jbHVzdGVyID0gbmV3IENsdXN0ZXJpemUoe1xyXG4gICAgcm93c19pbl9ibG9jazogMTAsXHJcbiAgICBibG9ja3NfaW5fY2x1c3RlcjogMyxcclxuICAgIHNjcm9sbEVsZW06IHNjclswXSxcclxuICAgIGNvbnRlbnRFbGVtOiBzY3JbMF1cclxuICB9KVxyXG5cclxuICBjb25zdCBlbW9qaUNsaWNrSGFuZGxlciA9ICQoJy5jaGFubmVsLXRleHRhcmVhLWVtb2ppJykuaGFzQ2xhc3MoJ3BvcG91dC1vcGVuJykgPyBwdXRFbW9qaUluVGV4dGFyZWEgOiBhZGRDdXJyZW50TWVzc2FnZVJlYWN0aW9uXHJcblxyXG4gIHNjclxyXG4gICAgLm9uKCdjbGljaycsICcuZW1vamktaXRlbScsIGUgPT4geyBjb25zb2xlLmxvZygnU2VsZWN0ZWQgZW1vamkgLSAnLCBjdXJyZW50UGlja2VyRW1vamlSZWdpc3RyeVskKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWVtb2ppJyldKSB9KVxyXG4gICAgLm9uKCdjbGljaycsICcuZW1vamktaXRlbScsIGUgPT4geyBlbW9qaUNsaWNrSGFuZGxlcihjdXJyZW50UGlja2VyRW1vamlSZWdpc3RyeVskKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWVtb2ppJyldKSB9KVxyXG4gICAgLm9uKCdtb3VzZWVudGVyJywgJy5lbW9qaS1pdGVtJywgZSA9PiB7XHJcbiAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdzZWxlY3RlZCcpXHJcbiAgICAgIGlmIChTRUFSQ0hfSU5QVVQpIHtcclxuICAgICAgICBTRUFSQ0hfSU5QVVQuYXR0cigncGxhY2Vob2xkZXInLCBjdXJyZW50UGlja2VyRW1vamlSZWdpc3RyeVskKGUudGFyZ2V0KS5hdHRyKCdkYXRhLWVtb2ppJyldLnVzZU5hbWUpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAub24oJ21vdXNlbGVhdmUnLCAnLmVtb2ppLWl0ZW0nLCBlID0+IHtcclxuICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJylcclxuICAgICAgaWYgKFNFQVJDSF9JTlBVVCkge1xyXG4gICAgICAgIFNFQVJDSF9JTlBVVC5hdHRyKCdwbGFjZWhvbGRlcicsICdGaW5kIHRoZSBwZXJmZWN0IGVtb2ppJylcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgcmV0dXJuIHNcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRTZXJ2ZXJTcGFuIChzZXJ2ZXIpIHtcclxuICBjb25zdCBzID0gJChDb25zdGFudHMuRUxFTUVOVF9TRVJWRVJfRU1PSklfTElTVClcclxuICBzLmZpbmQoJy5jYXRlZ29yeScpLmh0bWwoc2VydmVyLm5hbWUpXHJcblxyXG4gIHMuYXBwZW5kKGJ1aWxkRW1vamlzUm93cyhzZXJ2ZXIuYXZhaWxhYmxlRW1vamlzKCkpKVxyXG5cclxuICByZXR1cm4gcy5odG1sKClcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRFbW9qaXNSb3dzIChlTCkge1xyXG4gIGNvbnN0IHMgPSAkKCc8c3BhbiBjbGFzcz1cInRsLWVtb2ppLWxpc3RcIj48L3NwYW4+JylcclxuICBsZXQgciA9ICQoQ29uc3RhbnRzLkVMRU1FTlRfU0VSVkVSX0VNT0pJX0xJU1RfUk9XKVxyXG5cclxuICBjb25zdCBlbW9qaUVsZW1lbnQgPSBmdW5jdGlvbiAoZW1vamkpIHtcclxuICAgIHJldHVybiAkKENvbnN0YW50cy5FTEVNRU5UX1NFUlZFUl9FTU9KSV9MSVNUX1JPV19FTlRSWSlcclxuICAgICAgICAgICAgLmNzcygnYmFja2dyb3VuZC1pbWFnZScsIGB1cmwoXCIke2Vtb2ppLnVybH1cIilgKVxyXG4gICAgICAgICAgICAuYXR0cignZGF0YS1lbW9qaScsIGAke2N1cnJlbnRQaWNrZXJFbW9qaVJlZ2lzdHJ5LnB1c2goZW1vamkpIC0gMX1gKVxyXG4gIH1cclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBlTC5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKChpICE9PSAwKSAmJiAoaSAlIDEwID09PSAwKSkge1xyXG4gICAgICBzLmFwcGVuZChyKVxyXG4gICAgICByID0gJChDb25zdGFudHMuRUxFTUVOVF9TRVJWRVJfRU1PSklfTElTVF9ST1cpXHJcbiAgICB9XHJcbiAgICByLmFwcGVuZChlbW9qaUVsZW1lbnQoZUxbaV0pKVxyXG4gIH1cclxuICBzLmFwcGVuZChyKVxyXG5cclxuICByZXR1cm4gcy5odG1sKClcclxufVxyXG5cclxuZnVuY3Rpb24gcHV0RW1vamlJblRleHRhcmVhIChlbW9qaSkge1xyXG4gIGNvbnN0IHRleHRhcmVhID0gJCgnLmNoYW5uZWwtdGV4dGFyZWEgPj4gdGV4dGFyZWEnKVxyXG4gIHRleHRhcmVhLnZhbChgJHt0ZXh0YXJlYS52YWwoKSArIGVtb2ppLnVzZU5hbWV9IGApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZpbmRSZWFjdCAoZG9tKSB7XHJcbiAgZm9yIChjb25zdCBrZXkgaW4gZG9tKSB7XHJcbiAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJ19fcmVhY3RJbnRlcm5hbEluc3RhbmNlJCcpKSB7XHJcbiAgICAgIHJldHVybiBkb21ba2V5XVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbFxyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0U2VsZWN0ZWRNZXNzYWdlSWQgKCkge1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gQ29uc3RhbnRzLlJFQUNUSU9OX1BPUE9VVF9SRUdFWC5leGVjKFxyXG4gICAgICAgICAgICBmaW5kUmVhY3QoJCgnLmJ0bi1yZWFjdGlvbi5wb3BvdXQtb3BlbicpLmNsb3Nlc3QoJy5tZXNzYWdlJykuZmluZCgnLm1lc3NhZ2UtdGV4dCcpLmdldCgwKSlcclxuICAgICAgICAgICAgLl9jdXJyZW50RWxlbWVudC5wcm9wcy5jaGlsZHJlblxyXG4gICAgICAgICAgICAuZmlsdGVyKGMgPT4ge1xyXG4gICAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhjLnByb3BzKS5pbmNsdWRlcygnc3Vic2NyaWJlVG8nKVxyXG4gICAgICAgICAgICB9KVswXS5wcm9wcy5zdWJzY3JpYmVUbylbMV1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q3VycmVudFNlbGVjdGVkQ2hhbm5lbCAoKSB7XHJcbiAgcmV0dXJuIENvbnN0YW50cy5DVVJSRU5UX1NFTEVDVEVEX0NIQU5ORUxfUkVHRVguZXhlYyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpWzFdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEN1cnJlbnRNZXNzYWdlUmVhY3Rpb24gKGVtb2ppKSB7XHJcbiAgcmV0dXJuIGFkZE1lc3NhZ2VSZWFjdGlvbihnZXRDdXJyZW50U2VsZWN0ZWRDaGFubmVsKCksIGdldFNlbGVjdGVkTWVzc2FnZUlkKCksIGVtb2ppKVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRNZXNzYWdlUmVhY3Rpb24gKGNoYW5uZWwsIG1lc3NhZ2UsIGVtb2ppKSB7XHJcbiAgJC5hamF4KGAke0NvbnN0YW50cy5BUElfQkFTRX0vY2hhbm5lbHMvJHtjaGFubmVsfS9tZXNzYWdlcy8ke21lc3NhZ2V9L3JlYWN0aW9ucy86JHtlbW9qaS5uYW1lfToke2Vtb2ppLmlkfS9AbWVgLCB7IG1ldGhvZDogJ1BVVCcgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd09yaWdpbmFsU2Nyb2xsZXIgKCkge1xyXG4gIFNDUk9MTEVSX1dSQVAuaGlkZSgpXHJcbiAgU0NST0xMRVJfV1JBUF9PTEQuc2hvdygpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dDdXN0b21TY3JvbGxlciAoKSB7XHJcbiAgU0NST0xMRVJfV1JBUC5zaG93KClcclxuICBTQ1JPTExFUl9XUkFQX09MRC5oaWRlKClcclxuICBTQ1JPTExFUl9XUkFQLmZpbmQoJy5zY3JvbGxlcicpLnNjcm9sbFRvcCgwKVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXBsYWNlU2Nyb2xsZXIgKCkge1xyXG4gIFNDUk9MTEVSX1dSQVAgPSBidWlsZFNjcm9sbGVyV3JhcCgpXHJcbiAgU0NST0xMRVJfV1JBUF9PTEQgPSAkKENvbnN0YW50cy5FTU9KSV9QSUNLRVJfUEFUSCkuZmluZCgnLnNjcm9sbGVyLXdyYXAnKVxyXG4gIFNDUk9MTEVSX1dSQVBfT0xELmhpZGUoKS5iZWZvcmUoU0NST0xMRVJfV1JBUClcclxufVxyXG5cclxuZnVuY3Rpb24gcmVwbGFjZVNlYXJjaElucHV0ICgpIHtcclxuICAvLyBTRUFSQ0hfSU5QVVQgPSBidWlsZFNlYXJjaElucHV0KCk7XHJcbiAgLy8gJChFTU9KSV9QSUNLRVJfUEFUSCkuZmluZChcImlucHV0XCIpLmhpZGUoKS5iZWZvcmUoU0VBUkNIX0lOUFVUKTtcclxuICAvLyBUZW1wb3JhcnkgZGlzYWJsZWQsIGFzIG9yaWdpbmFsIHNlYXJjaCBoYXZlIG11Y2ggYmV0dGVyIHBlcmZvcm1hbmNlXHJcbiAgU0VBUkNIX0lOUFVUID0gJChDb25zdGFudHMuRU1PSklfUElDS0VSX1BBVEgpLmZpbmQoJ2lucHV0JylcclxuICBTRUFSQ0hfSU5QVVQuY2hhbmdlKChlKSA9PiB7XHJcbiAgICBpZiAoISQoZS50YXJnZXQpLnZhbCgpKSB7XHJcbiAgICAgIHNob3dDdXN0b21TY3JvbGxlcigpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzaG93T3JpZ2luYWxTY3JvbGxlcigpXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQ3VzdG9tU2Nyb2xsZXJQYXJ0cyAoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcInBpY2tlciBvcGVuZWRcIik7XHJcbiAgc2V0VGltZW91dChyZXBsYWNlU2Nyb2xsZXIsIDIwKVxyXG4gIHNldFRpbWVvdXQocmVwbGFjZVNlYXJjaElucHV0LCAyMClcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSAkKENvbnN0YW50cy5FTU9KSV9QSUNLRVJfUEFUSCkuZmluZCgnLmNhdGVnb3JpZXMnKVxyXG4gICAgY29uc3QgY2F0ZWdvcmllc0NoaWxkcmVuID0gY2F0ZWdvcmllcy5jaGlsZHJlbigpXHJcbiAgICBjb25zdCBjdXN0b21TY3JvbGxlciA9IFsncmVjZW50JywgJ2N1c3RvbSddXHJcblxyXG4gICAgY2F0ZWdvcmllcy5vbignY2xpY2snLCAnLml0ZW0nLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpXHJcblxyXG4gICAgICBjYXRlZ29yaWVzQ2hpbGRyZW4ucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJylcclxuICAgICAgJHRoaXMuYWRkQ2xhc3MoJ3NlbGVjdGVkJylcclxuXHJcbiAgICAgIGN1c3RvbVNjcm9sbGVyLmZvckVhY2goZnVuY3Rpb24gKGNhdGVnb3J5KSB7XHJcbiAgICAgICAgaWYgKCR0aGlzLmhhc0NsYXNzKGNhdGVnb3J5KSkge1xyXG4gICAgICAgICAgc2hvd0N1c3RvbVNjcm9sbGVyLmNhbGwodGhpcywgZXZlbnQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG5cclxuICAgICAgc2hvd09yaWdpbmFsU2Nyb2xsZXIuY2FsbCh0aGlzLCBldmVudClcclxuICAgIH0pXHJcbiAgfSwgMjApXHJcbiAgc2V0VGltZW91dChzaG93Q3VzdG9tU2Nyb2xsZXIsIDMwKVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5idWlsZFNlcnZlclNwYW4gPSBidWlsZFNlcnZlclNwYW5cclxubW9kdWxlLmV4cG9ydHMuc2hvdyA9IGFkZEN1c3RvbVNjcm9sbGVyUGFydHNcclxuXHJcbm1vZHVsZS5leHBvcnRzLnNldENvbW1vbkVtb2ppU3BhbkNhY2hlID0gZnVuY3Rpb24gKGNhY2hlKSB7XHJcbiAgY29tbW9uRW1vamlzU3BhbnNDYWNoZSA9IGNhY2hlXHJcbn1cclxuIiwiY29uc3QgRW1vamkgPSByZXF1aXJlKCcuL2Vtb2ppLmpzJylcclxuXHJcbmNvbnN0IEdMT0JBTF9TRVJWRVJfTElTVCA9IFtdXHJcblxyXG5jb25zdCBpZCA9IFN5bWJvbCgnaWQnKVxyXG5jb25zdCBuYW1lID0gU3ltYm9sKCduYW1lJylcclxuY29uc3QgZW1vamlzID0gU3ltYm9sKCdlbW9qaXMnKVxyXG5jb25zdCBzaGFyZWRFbW9qaXMgPSBTeW1ib2woJ3NoYXJlZEVtb2ppcycpXHJcbmNvbnN0IHBlcm1pc3Npb25zID0gU3ltYm9sKCdwZXJtaXNzaW9ucycpXHJcbmNvbnN0IHNlcnZlclJlZ2V4ID0gU3ltYm9sKCdzZXJ2ZXJSZWdleCcpXHJcblxyXG5jbGFzcyBTZXJ2ZXIge1xyXG4gIGNvbnN0cnVjdG9yIChfaWQsIF9uYW1lLCBfcGVybWlzc2lvbnMsIF9lbW9qaXMgPSBbXSwgX3NoYXJlZEVtb2ppcyA9IFtdKSB7XHJcbiAgICBpZiAoR0xPQkFMX1NFUlZFUl9MSVNULnNvbWUocyA9PiBzLmlkID09PSBfaWQpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGhhdmUgbXVsdGlwbGUgc2VydmVycyB3aXRoIHNhbWUgaWQhJylcclxuICAgIH1cclxuXHJcbiAgICB0aGlzW2lkXSA9IF9pZFxyXG4gICAgdGhpc1tuYW1lXSA9IF9uYW1lXHJcbiAgICB0aGlzW3Blcm1pc3Npb25zXSA9IF9wZXJtaXNzaW9uc1xyXG4gICAgdGhpc1tlbW9qaXNdID0gX2Vtb2ppc1xyXG4gICAgdGhpc1tzaGFyZWRFbW9qaXNdID0gX3NoYXJlZEVtb2ppc1xyXG4gICAgdGhpc1tzZXJ2ZXJSZWdleF0gPSBuZXcgUmVnRXhwKGAuKi8ke19pZC50b1N0cmluZygpfS9cXFxcZCtgKVxyXG5cclxuICAgIEdMT0JBTF9TRVJWRVJfTElTVC5wdXNoKHRoaXMpXHJcbiAgfVxyXG5cclxuICBhZGRFbW9qaSAoZW1vamkpIHtcclxuICAgIGlmICghKGVtb2ppIGluc3RhbmNlb2YgRW1vamkpKSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09ubHkgb2JqZWN0cyBvZiBjbGFzcyBFbW9qaSBjYW4gYmUgYWRkZWQgdXNpbmcgdGhpcyBtZXRob2QnKVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzW2Vtb2ppc10uc29tZShlID0+IGUuaWQgPT09IGVtb2ppLmlkKSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICB0aGlzW2Vtb2ppc10ucHVzaChlbW9qaSlcclxuXHJcbiAgICBpZiAoZW1vamkuaXNNYW5hZ2VkKSB7XHJcbiAgICAgIHRoaXNbc2hhcmVkRW1vamlzXS5wdXNoKGVtb2ppKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG5cclxuICBnZXQgY2FuVXNlRXh0ZXJuYWxFbW9qaXMgKCkge1xyXG4gICAgcmV0dXJuIHRoaXNbcGVybWlzc2lvbnNdICYgMHgwMDA0MDAwMFxyXG4gIH1cclxuXHJcbiAgZ2V0IGlkICgpIHtcclxuICAgIHJldHVybiB0aGlzW2lkXVxyXG4gIH1cclxuXHJcbiAgZ2V0IG5hbWUgKCkge1xyXG4gICAgcmV0dXJuIHRoaXNbbmFtZV1cclxuICB9XHJcblxyXG4gIGdldCBwZXJtaXNzaW9ucyAoKSB7XHJcbiAgICByZXR1cm4gdGhpc1twZXJtaXNzaW9uc11cclxuICB9XHJcblxyXG4gIGdldCBlbW9qaXMgKCkge1xyXG4gICAgcmV0dXJuIHRoaXNbZW1vamlzXVxyXG4gIH1cclxuXHJcbiAgZ2V0IHNoYXJlZEVtb2ppcyAoKSB7XHJcbiAgICByZXR1cm4gdGhpc1tzaGFyZWRFbW9qaXNdXHJcbiAgfVxyXG5cclxuICBpc0N1cnJlbnQgKCkge1xyXG4gICAgcmV0dXJuIHRoaXNbc2VydmVyUmVnZXhdLnRlc3Qod2luZG93LmxvY2F0aW9uKVxyXG4gIH1cclxuXHJcbiAgYXZhaWxhYmxlRW1vamlzICgpIHtcclxuICAgIHJldHVybiB0aGlzLmlzQ3VycmVudCgpID8gdGhpcy5lbW9qaXMgOiB0aGlzLnNoYXJlZEVtb2ppc1xyXG4gIH1cclxuXHJcbiAgcG9zc2libGVFbW9qaXMgKCkge1xyXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZW1vamlzXHJcblxyXG4gICAgZm9yIChjb25zdCBzZXJ2ZXIgb2YgR0xPQkFMX1NFUlZFUl9MSVNUKSB7XHJcbiAgICAgIGlmIChzZXJ2ZXIuaWQgPT09IHRoaXMuaWQpIHtcclxuICAgICAgICBjb250aW51ZVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsaXN0LnB1c2goLi4uc2VydmVyLnNoYXJlZEVtb2ppcylcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGlzdFxyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldEN1cnJlbnRTZXJ2ZXIgKCkge1xyXG4gICAgcmV0dXJuIEdMT0JBTF9TRVJWRVJfTElTVC5yZWR1Y2UoKHAsIGMpID0+IChwIHx8IChjLmlzQ3VycmVudCgpICYmIGMpKSwgZmFsc2UpIHx8IG51bGxcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRBbGxTZXJ2ZXJzICgpIHtcclxuICAgIHJldHVybiBHTE9CQUxfU0VSVkVSX0xJU1RcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRCeUlkIChpZCkge1xyXG4gICAgcmV0dXJuIEdMT0JBTF9TRVJWRVJfTElTVC5yZWR1Y2UoKHAsIGMpID0+IChwIHx8ICgoYy5pZCA9PT0gaWQpICYmIGMpKSwgZmFsc2UpIHx8IG51bGxcclxuICB9XHJcbn1cclxuXHJcbi8vIFN0b3JlIFwiaW5ib3hcIiBlbXVsYXRpb24gb2Ygc2VydmVyXHJcbm5ldyBTZXJ2ZXIoJ0BtZScsICdAbWUnLCAweDAwMDQwMDAwKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2ZXJcclxuIl19
