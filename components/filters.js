const html = require('choo/html')

const StopWords = (state, emit) => {
  const wordList = state.stopWords.map((word, i) => {
    return html`
      <li>
        ${word}
        <button onclick=${() => emit('removeStopWord', i)}>x</button>
      </li>
    `
  })

  const onsubmit = (e) => {
    e.preventDefault()
    return false
  }

  return html`
    <div class="stop-words">
      <h3>Stop words</h3>
      <form id="word-form" onsubmit=${onsubmit}>
        <input type="text" name="word">
        <button onclick=${() => emit('addStopWord')}>Add stop word</button>
      </form>
      <ul>
        ${wordList}
      </ul>
    </div>
  `
}

const Filters = (state, emit) => {
  return html`
    ${StopWords(state, emit)}
  `
}

module.exports = Filters;
