const html = require('choo/html')

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

module.exports = SpeechToText
