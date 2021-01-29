const choo = require('choo')
const html = require('choo/html')

const Accordion = require('./components/accordion.js')

const Video = require('./components/video.js')
const Filters = require('./components/filters.js')
const SpeechToText = require('./components/speech.js')
const Cloud = require('./components/cloud.js')

const store = require('./store.js')

const mainView = (state, emit) => {
  const VideoAccordion = Accordion(
    {
      title: 'Video',
      open: state.videoOpen,
      onToggle: () => emit('toggleAccordion', 'videoOpen')
    },
    Video(state, emit)
  )
  const FiltersAccordion = Accordion(
    {
      title: 'Filters',
      open: state.filtersOpen,
      onToggle: () => emit('toggleAccordion', 'filtersOpen')
    },
    Filters(state, emit)
  )
  const CloudAccordion = Accordion(
    {
      title: 'Word cloud',
      open: state.cloudOpen,
      onToggle: () => emit('toggleAccordion', 'cloudOpen')
    },
    [
      SpeechToText(state, emit),
      Cloud(state, emit)
    ]
  )
  return html`
    <body>
      ${VideoAccordion}
      ${!state.recognizing ? FiltersAccordion : null}
      ${CloudAccordion}
    </body>
  `
}

var app = choo()
app.use(store)
app.route('*', mainView)
app.mount('body')
