const html = require('choo/html')

const Cloud = (state, emit) => {
  return html`
    <div class="cloud">
      ${WordCloud(state, emit)}
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
  let sum = Object.values(filteredWords).reduce((acc, value) => {
    acc += value
    return acc
  }, 1)

  let words = Object.values(filteredWords).map((value, i) => {
    let word = Object.keys(filteredWords)[i]
    let weight = (value / sum) * 20
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
