const choo = require('choo')
const html = require('choo/html')

const Video = require('./components/video.js')
const StopWords = require('./components/stopwords.js')
const SpeechToText = require('./components/speech.js')
const Cloud = require('./components/cloud.js')
const Transcript = require('./components/transcript.js')

const store = require('./store.js')

const mainView = (state, emit) => {
  let showSettings = html`<button onclick=${() => emit('showSettings')}>Settings</button>`
  let showCloud = html`<button onclick=${() => emit('hideSettings')}>Cloud</button>`
  let cloud = html`<div></div>`
  let settings = html`
    <div>

    </div>
  `
  return html`
    <body>
      <div class="menu">
        ${state.settingsOpened ? showCloud : showSettings}
      </div>
      <div class="fullscreen ${state.settingsOpened ? 'hidden' : 'open'}">
        ${Cloud(state, emit)}
        ${SpeechToText(state, emit)}
      </div>
      <div class="${state.settingsOpened ? 'open' : 'hidden'}">
        <h2>Video:</h2>
        <div>${Video(state, emit)}</div>
        <h2>Stop words:</h2>
        <div>${StopWords(state, emit)}</div>
        <h2>Transcript:</h2>
        <div>${Transcript(state, emit)}</div>
      </div>
    </body>
  `
}

var app = choo()
app.use(store)
app.route('*', mainView)
app.mount('body')
