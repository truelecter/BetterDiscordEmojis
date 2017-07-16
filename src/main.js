const Server = require('./server.js')
const Emoji = require('./emoji.js')
const Constants = require('./constants.js')

const Clusterize = require('./lib/clusterize.js')

let MY_ID = ''

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
  commonEmojisSpansCache = ''

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
      commonEmojisSpansCacheSpan.append(buildServerSpan(fakeServer))
    }

    commonEmojisSpansCache = commonEmojisSpansCacheSpan.html()

    resolve(commonEmojis)
  })
}

function doGetEmojis () {
  const token = Constants.LOCAL_STORAGE_MODULE.impl.get(Constants.TOKEN_KEY)

  $.ajaxSetup({
    'crossDomain': true,
    'headers': { 'authorization': token }
  })

  getMyId()
    .then(getServers)
    .then(parseServers)
    .then(loadStandartEmojis)
    .then(() => { console.log('Better Emojis initialized') })
    .catch(e => { console.error('Error initializing Better Emojis!\nProbably modules order has been changed\n', e) })
}

doGetEmojis()

function watchForEmojiPickerChange (listener) {
  const observer = new MutationObserver(mutations => {
    if (listener) {
      listener(mutations)
    }
  })
  const config = { childList: true }
  observer.observe($(Constants.EMOJI_PICKER_PATH)[0], config)
  return observer
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

var EMOJI_PICKER_OBSERVER

setTimeout(() => {
  EMOJI_PICKER_OBSERVER = watchForEmojiPickerChange(([mutation]) => {
    if (mutation.type === 'childList') {
      if (mutation.addedNodes.length > 0) {
        if ($(Constants.EMOJI_PICKER_PATH).find('.emoji-picker').length &&
                    ($('.channel-textarea-emoji').hasClass('popout-open') || $('.btn-reaction.popout-open').length)) {
          addCustomScrollerParts()
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
