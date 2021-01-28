const choo = require('choo')
const html = require('choo/html')

const Video = require('./components/video.js')
const Cloud = require('./components/cloud.js')
const store = require('./store.js')

const mainView = (state, emit) => {
  return html`
    <body>
      ${Video(state, emit)}
      ${Cloud(state, emit)}
    </body>
  `
}

var app = choo()
app.use(store)
app.route('*', mainView)
app.mount('body')
