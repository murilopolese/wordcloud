let stopWords = require('./stop_words.json')

function processWords(state) {
  let words = state.text + state.interim_transcript
  words = words.replaceAll('.', '')
  words = words.replaceAll(',', '')
  words = words.replaceAll(',', '')
  words = words.split(' ')
  // if (words.length > 50) {
  //   words = words.slice(-50)
  // }
  return words.reduce(function(acc, word) {
    if (acc[word]) {
      acc[word] += 1
    } else {
      acc[word] = 1
    }
    return acc
  }, {})
}

module.exports = (state, emitter) => {
  state.videoUrl = null
  state.videoId = null
  state.videoError = null

  state.stopWords = stopWords
  state.wordInput = ''
  state.minCount = 2
  state.words = {}
  state.text = ``
  state.interim_transcript = ''

  state.recognitionError = null
  state.recognizing = false
  if (window.webkitSpeechRecognition) {
    state.recognition = new webkitSpeechRecognition()
    state.recognition.continuous = true
    state.recognition.interimResults = true
    state.recognition.onstart = function() {
      state.recognizing = true
      emitter.emit('render')
    }
    state.recognition.onend = function() {
      state.recognizing = false
      emitter.emit('render')
    }
    state.recognition.onresult = function(event) {
      state.interim_transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          state.text += event.results[i][0].transcript;
        } else {
          state.interim_transcript += event.results[i][0].transcript;
        }
      }

      state.words = processWords(state)
      state.recognitionError = null
      emitter.emit('render')
    }
    state.recognition.onerror = function(event) {
      state.recognizing = false
      if (event.error == 'no-speech') {
        state.recognitionError = 'no_speech'
      }
      if (event.error == 'audio-capture') {
        state.recognitionError = 'no_microphone'
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - state.start_timestamp < 100) {
          state.recognitionError = 'blocked'
        } else {
          state.recognitionError = 'denied'
        }
      }
    }
  } else {
    state.recognitionError = "This website only works on Google Chrome :("
  }

  // Accordion
  state.videoOpen = true
  state.filtersOpen = false
  state.speechOpen = false
  state.cloudOpen = false

  emitter.on('loadVideo', () => {
    let input = document.querySelector('.video-controls input[name="videoUrl"]')
    let value = input ? input.value : ''
    try {
      let url = new URL(value)
      state.videoId = url.searchParams.get('v')
      state.videoError = null
    } catch (e) {
      state.videoError = 'Invalid url'
    }
    emitter.emit('render')
  })

  emitter.on('removeStopWord', (i) => {
    state.stopWords.splice(i, 1)
    emitter.emit('render')
  })
  emitter.on('addStopWord', () => {
    let input = document.querySelector('#word-form input[name="word"]')
    if (input && input.value !== '') {
      state.stopWords.unshift(input.value)
    }
    emitter.emit('render')
  })
  emitter.on('changeWordInput', (word) => {
    state.wordInput = word
    emitter.emit('render')
  })

  emitter.on('startRecognition', () => {
    state.recognizing = true
    state.recognition.start()
    emitter.emit('render')
  })
  emitter.on('stopRecognition', () => {
    state.recognizing = true
    state.recognition.stop()
    emitter.emit('render')
  })

  emitter.on('toggleAccordion', (prop) => {
    state[prop] = !state[prop]
    emitter.emit('render')
  })

}
