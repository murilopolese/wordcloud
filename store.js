function processWords(state) {
  let words = state.text + state.interim_transcript
  words = words.replaceAll('.', '')
  words = words.replaceAll(',', '')
  words = words.replaceAll(',', '')
  words = words.split(' ')
  return words.reduce(function(acc, word) {
    // if (state.stopWords.indexOf(word) === -1) {
      if (acc[word]) {
        acc[word] += 1
      } else {
        acc[word] = 1
      }
    // }
    return acc
  }, {})
}


module.exports = (state, emitter) => {
  setTimeout(() => {
    emitter.emit('loadVideo', state.videoUrl)
  }, 500)
  state.videoUrl = 'https://www.youtube.com/watch?v=ibrwte1QqUE&feature=emb_title&ab_channel=JaySilver'
  state.videoId = null
  state.videoError = null

  state.stopWords = ["a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"]
  state.wordInput = ''
  state.minCount = 2
  state.words = {}
  state.text = ''
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

  emitter.on('loadVideo', (value) => {
    state.videoUrl = value
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
    if (state.wordInput !== '') {
      state.stopWords.unshift(state.wordInput)
      state.wordInput = ''
      emitter.emit('render')
    }
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

}
