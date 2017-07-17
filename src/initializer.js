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
