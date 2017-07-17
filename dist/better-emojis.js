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
  Picker.setCommonEmojiSpanCache(spanCache)
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
      if (!server.isCurrent() && server.sharedEmojis.length > 0) {
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
            findReact($('.btn-reaction.popout-open').parent().get(0))
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
//# sourceMappingURL=better-emojis.js.map