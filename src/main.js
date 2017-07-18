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
