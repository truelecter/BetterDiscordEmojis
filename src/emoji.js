const id = Symbol('id')
const name = Symbol('name')
const url = Symbol('url')
const managed = Symbol('managed')
const requireColons = Symbol('requireColons')
const roles = Symbol('roles')

const GLOBAL_EMOJI_MAP = new Map()

class Emoji {
  constructor (_id, _name, _managed = false, _requireColons = true, _roles = [], _url = `https://cdn.discordapp.com/emojis/${_id}.png`) {
    this[id] = _id
    this[name] = _name
    this[url] = _url
    this[managed] = _managed
    this[requireColons] = _requireColons
    this[roles] = _roles

    GLOBAL_EMOJI_MAP.set(this[id], this)
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

  static getById (id) {
    return GLOBAL_EMOJI_MAP.get(id)
  }
}

module.exports = Emoji
