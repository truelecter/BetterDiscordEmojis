let MY_ID = ''
const API_BASE = 'https://discordapp.com/api'

/* May be changed with discord updates */
const EMOJI_PICKER_PATH = '#app-mount > div > div:nth-child(7)'
const LOCAL_STORAGE_MODULE = n(1590)
const EMOJI_STORAGE_MODULE = n(168).default
const TRANSLATION_MODULE = n(3)
/* May be changed with discord updates.END */

const ELEMENT_SCROLLER_WRAP = '<div class="scroller-wrap"><div class="scroller"></div></div>'

const ELEMENT_SEARCH_INPUT = '<input type="text" placeholder="Find the perfect emoji" value="">'

const ELEMENT_SERVER_EMOJI_LIST = '<span class="server-emojis"><div class="category">server.name</div></span>'
const ELEMENT_SERVER_EMOJI_LIST_ROW = '<div class="row"></div>'
const ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY = '<div class="emoji-item"></div>' // max 10 per row

const servers = []
const commonEmojis = []
let commonEmojisSpansCache = ''
let currentPickerEmojiRegistry = []

let SCROLLER_WRAP = null
let SCROLLER_WRAP_OLD = null
let SEARCH_INPUT = null

const REACTION_POPOUT_REGEX = /TOGGLE_REACTION_POPOUT_(\d+)/
const CURRENT_SELECTED_CHANNEL_REGEX = /.*\/.+\/(\d+)/
const CURRENT_SELECTED_SERVER_REGEX = /.*\/(\d+)\/\d+/
const IS_INBOX_REGEX = /\/channels\/@me\/\d+/

const OPTIONS = { enabled: true, showOnlyCustomEmojisInSearch: false, showOnlyCustomEmojistInList: false }

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
    return REACTION_POPOUT_REGEX.exec(
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
  return CURRENT_SELECTED_CHANNEL_REGEX.exec(window.location.pathname)[1]
}

function addCurrentMessageReaction (emoji) {
  return addMessageReaction(getCurrentSelectedChannel(), getSelectedMessageId(), emoji)
}

function addMessageReaction (channel, message, emoji) {
  $.ajax(`${API_BASE}/channels/${channel}/messages/${message}/reactions/:${emoji.name}:${emoji.id}/@me`, { method: 'PUT' })
}

function replaceScroller () {
  SCROLLER_WRAP = buildScrollerWrap()
  SCROLLER_WRAP_OLD = $(EMOJI_PICKER_PATH).find('.scroller-wrap')
  SCROLLER_WRAP_OLD.hide().before(SCROLLER_WRAP)
}

function replaceSearchInput () {
  // SEARCH_INPUT = buildSearchInput();
  // $(EMOJI_PICKER_PATH).find("input").hide().before(SEARCH_INPUT);
  // Temporary disabled, as original search have much better performance
  SEARCH_INPUT = $(EMOJI_PICKER_PATH).find('input')
  SEARCH_INPUT.change((e) => {
    if (!$(e.target).val()) {
      showCustomScroller()
    } else {
      showOriginalScroller()
    }
  })
}

function buildSearchInput () {
  const r = $(ELEMENT_SEARCH_INPUT)

  r.on('change keydown keyup paste', () => {
    if (r.val().replace(/\s+/g, '')) {
      SCROLLER_WRAP.find('.scroller').html(' ')
      SCROLLER_WRAP.find('.scroller').append(buildEmojisRows(filterEmojis(r.val())))
    } else {
      buildScrollerWrap()
    }
  })

  return r
}

function buildSearchResult (query) {
  return buildEmojisRows(filterEmojis(query))
}

function filterEmojis (query) {
  const eL = getEmojisForServer(getCurrentServer())
  const r = []

  query = query.toLowerCase()

  for (const e of eL) {
    if (e.name.toLowerCase().includes(query)) {
      r.push(e)
    }
  }

  return r
}

function getEmojisForServer (server) {
  const e = []

  for (const s of servers) {
    if (!server.canUserSharedEmojis && s.id !== server.id) {
      continue
    }

    const eL = ((server.id === s.id) ? s.emojis : s.sharedEmojis)
    for (const k of eL) {
      e.push(k)
    }
  }

  return e
}

function buildScrollerWrap () {
  const s = SCROLLER_WRAP || $(ELEMENT_SCROLLER_WRAP)
  const scr = s.find('.scroller')
  scr.html(' ').off('click').off('mouseenter').off('mouseleave')

  const c = getCurrentServer()
    // Append all current server emojis, if any
  if (c.emojis.length > 0) { scr.append(buildServerSpan(c)) }

    // Append all other server shared emojis
  if (c.canUserSharedEmojis) {
    for (const server of servers) {
      if (!isCurrentSelectedServer(server) && server.sharedEmojis.length > 0) {
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

  scr.on('click', '.emoji-item', e => { console.log('Selected emoji - ', currentPickerEmojiRegistry[$(e.target).attr('data-emoji')]) })
        .on('click', '.emoji-item', e => { emojiClickHandler(currentPickerEmojiRegistry[$(e.target).attr('data-emoji')]) })
        .on('mouseenter', '.emoji-item', e => {
          $(e.target).addClass('selected')
          if (SEARCH_INPUT) {
            SEARCH_INPUT.attr('placeholder', emojiInTextarea(currentPickerEmojiRegistry[$(e.target).attr('data-emoji')]))
          }
        })
        .on('mouseleave', '.emoji-item', e => {
          $(e.target).removeClass('selected')
          if (SEARCH_INPUT) {
            SEARCH_INPUT.attr('placeholder', 'Find the perfect emoji')
          }
        })

  console.log('asdasd')

  return s
}

function isInInbox () {
  return IS_INBOX_REGEX.test(window.location)
}

function getCurrentServer () {
  if (isInInbox()) {
    return { canUserSharedEmojis: true, emojis: [], sharedEmojis: [], id: '@me' }
  }

  for (const server of servers) {
    if (isCurrentSelectedServer(server)) {
      return server
    }
  }
    // should never happen
  throw new Error('Unknown server selected')
}

function isCurrentSelectedServer (server) {
  const currentServerIdRes = CURRENT_SELECTED_SERVER_REGEX.exec(window.location)
  return currentServerIdRes && (`${server.id}`) === currentServerIdRes[1]
}

function buildEmojisRows (eL) {
  const s = $('<span class="tl-emoji-list"></span>')
  let r = $(ELEMENT_SERVER_EMOJI_LIST_ROW)

  function emojiElement (emoji) {
    return $(ELEMENT_SERVER_EMOJI_LIST_ROW_ENTRY)
            .css('background-image', `url("${emoji.url}")`)
            .attr('data-emoji', `${currentPickerEmojiRegistry.push(emoji) - 1}`)
  }

  for (const i in eL) {
        // console.log(i, eL);
    if ((i !== 0) && (i % 10 === 0)) {
      s.append(r)
      r = $(ELEMENT_SERVER_EMOJI_LIST_ROW)
    }
    r.append(emojiElement(eL[i]))
  }
  s.append(r)

  return s.html()
}

function buildServerSpan (server) {
  const s = $(ELEMENT_SERVER_EMOJI_LIST)
  s.find('.category').html(server.name)

  const eL = isCurrentSelectedServer(server) ? server.emojis : server.sharedEmojis

  s.append(buildEmojisRows(eL))

  return s.html()
}

function putEmojiInTextarea (emoji) {
  const textarea = $('.channel-textarea >> textarea')
  textarea.val(`${textarea.val() + emojiInTextarea(emoji)} `)
}

function emojiInTextarea (emoji) {
  return emoji.require_colons ? (`:${emoji.name}:`) : emoji.name
}

function getEmojiUrl (emoji) {
  return `https://cdn.discordapp.com/emojis/${emoji.id}.png`
}

function getServers () {
  return new Promise((resolve, reject) => {
    $.ajax({
      'async': true,
      'url': `${API_BASE}/users/@me/guilds`,
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
      'url': `${API_BASE}/users/@me`,
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
      'url': `${API_BASE}/guilds/${server.id}/members/${MY_ID}`,
      'method': 'GET'
    }).done(response => {
      // fill base server info
      const srv = {}
      srv.roles = response.roles
      srv.id = server.id
      srv.emojis = []
      srv.sharedEmojis = []
      srv.permissions = server.permissions
      // test if we can use custom emojis on this server
      srv.canUserSharedEmojis = ((srv.permissions & 0x00040000) !== 0)

      $.ajax({
        'async': true,
        'url': `${API_BASE}/guilds/${srv.id}`,
        'method': 'GET'
      }).done(response => {
        // now we got detailed info about server. fill emoji and managed emojis.
        // also set name
        srv.name = response.name

        response.emojis.forEach(emoji => {
          // get emoji required roles
          const eR = emoji.roles
          // no roles required for emoji
          emoji.url = getEmojiUrl(emoji)
          if (!eR.length) {
            srv.emojis.push(emoji)
            if (emoji.managed) {
              srv.sharedEmojis.push(emoji)
            }
            return
          }
          for (const r in eR) {
            // we have required role
            // console.log(srv.roles, eR, srv.roles.indexOf(eR[i]));
            if (srv.roles.includes(r)) {
              srv.emojis.push(emoji)
              if (emoji.managed) {
                srv.sharedEmojis.push(emoji)
              }
              break
            }
          }
        })
        // save server info
        servers.push(srv)
        resolve(srv)
      })
    })
  })
}

function parseServers (serversA) {
  return Promise.all(serversA.map(srv => parseServer(srv)))
}

function n (id) {
  return webpackJsonp([], [], [id])
}

function loadStandartEmojis () {
  commonEmojis.length = 0
  commonEmojisSpansCache = ''

  return new Promise((resolve, reject) => {
    const translation = TRANSLATION_MODULE.Messages
    const categories = EMOJI_STORAGE_MODULE.getCategories()
    let commonEmojisSpansCacheSpan = $('<span></span>')

    for (let category of categories) {
      const fakeServer = { sharedEmojis: [], name: translation[`EMOJI_CATEGORY_${category.toUpperCase()}`] }
      const emojis = EMOJI_STORAGE_MODULE.getByCategory(category)

      for (let emoji of emojis) {
        let fakeEmoji = {
          require_colons: emoji.allNamesString.includes(':'),
          managed: emoji.managed,
          name: emoji.uniqueName,
          roles: [],
          id: emoji.index,
          url: emoji.defaultUrl
        }

        fakeServer.sharedEmojis.push(fakeEmoji)
      }

      commonEmojis.push(fakeServer)
      commonEmojisSpansCacheSpan.append(buildServerSpan(fakeServer))
    }

    commonEmojisSpansCache = commonEmojisSpansCacheSpan.html()

    resolve(commonEmojis)
  })
}

function doGetEmojis () {
  const token = LOCAL_STORAGE_MODULE.impl.get(n(0).TOKEN_KEY)

  servers.length = 0
  MY_ID = ''
    // common stuff for all requests
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
  observer.observe($(EMOJI_PICKER_PATH)[0], config)
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

function addCustomScrollerParts () {
    // console.log("picker opened");
  setTimeout(replaceScroller, 20)
  setTimeout(replaceSearchInput, 20)
  setTimeout(() => {
    const categories = $(EMOJI_PICKER_PATH).find('.categories')
    const categoriesChildren = categories.children()
    const customScroller = ['recent', 'custom']

    categories.on('click', '.item', function (event) {
      const $this = $(this)

      categoriesChildren.removeClass('selected')

            // this.target.classList.add('selected');
            // Uncaught TypeError: Cannot read property 'classList' of undefined
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
        if ($(EMOJI_PICKER_PATH).find('.emoji-picker').length &&
                    ($('.channel-textarea-emoji').hasClass('popout-open') || $('.btn-reaction.popout-open').length)) {
          addCustomScrollerParts()
        }
                // replaceScroller();
      }
      if (mutation.removedNodes.length) {
        if (window.better_emojis.current_cluster) {
          window.better_emojis.current_cluster.destroy()
        }
                // console.log("picker closed");
      }
    }
  })
}, 2000)
