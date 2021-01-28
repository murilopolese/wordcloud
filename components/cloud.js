const html = require('choo/html')

const Cloud = (state, emit) => {
  return html`
    <div class="cloud">
      ${SpeechToText(state, emit)}
      ${StopWords(state, emit)}
      ${WordCloud(state, emit)}
    </div>
  `
}

const StopWords = (state, emit) => {
  const wordList = state.stopWords.map((word, i) => {
    return html`
      <li>
        ${word}
        <button onclick=${() => emit('removeStopWord', i)}>x</button>
      </li>
    `
  })
  const changeInput = (e) => {
    if (e.key === 'Enter') {
      emit('addStopWord')
    } else {
      let input = document.querySelector('#word-form input[name="word"]')
      if (input) {
        emit('changeWordInput', input.value)
      }
    }
  }
  const wordForm = html`
    <div id="word-form">
      <input value=${state.wordInput} type="text" name="word" onkeyup=${changeInput}>
      <button onclick=${() => emit('addStopWord')}>Add stop word</button>
    </div>
  `

  if (state.recognizing) {
    return html`
      <div class="stop-words">
        <div id="word-form">
          Stop recognizing to change stop words
        </div>
      </div>
    `
  } else {
    return html`
      <div class="stop-words">
        ${wordForm}
        <ul>
          ${wordList}
        </ul>
      </div>
    `
  }
}
const SpeechToText = (state, emit) => {
  let button = null
  if (state.recognition) {
    if (state.recognizing) {
      button = html`<button onclick=${() => emit('stopRecognition')}>Stop listening</button>`
    } else {
      button = html`<button onclick=${() => emit('startRecognition')}>Start listening</button>`
    }
  }
  return html`
    <div class="speech-to-text">
      ${button}
      <div>${state.recognitionError || ''}</div>
    </div>
  `
}
const WordCloud = (state, emit) => {
  let filteredWords = Object.keys(state.words).reduce((acc, word) => {
    if (
      state.stopWords.indexOf(word) === -1
      && state.words[word] >= state.minCount
    ) {
      acc[word] = state.words[word]
    }
    return acc
  }, {})

  let words = Object.values(filteredWords).map((value, i) => {
    let word = Object.keys(filteredWords)[i]
    let weight = value
    return html`
      <span style="font-size: ${weight}em">
        ${word}
      </span>
    `
  })
  return html`
    <div class="word-cloud">
      ${words}
    </div>
    <div class="text">
      <em>Original text:</em>
      ${state.text} ${state.interim_transcript}
    </div>
  `
}

module.exports = Cloud
