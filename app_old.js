let stopWords = [
  "the", "I",
  "a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"
]

function processWords(state) {
  let words = state.final_transcript + state.interim_transcript
  words = words.replaceAll('.', '')
  words = words.replaceAll(',', '')
  words = words.replaceAll(',', '')
  words = words.split(' ')
  return words.reduce(function(acc, word) {
    if (stopWords.indexOf(word) === -1) {
      if (acc[word]) {
        acc[word] += 1
      } else {
        acc[word] = 1
      }
    }
    return acc
  }, {})
}

function styleWords(words) {
  return Object.keys(words)
    .map(function(word) {
      let count = words[word]
      let size = 0
      if (count > 1) {
        size = count * 5
      }
      return `<span style="font-size:${size}px">${word}</span>`
    })
    .join('')
}

window.onload = function() {
  let state = {
    recognizing: false,
    final_transcript: '',
    interim_transcript: '',
    start_timestamp: 0,
    wordsOutput: document.querySelector('#words'),
    textOutput: document.querySelector('#text'),
    interimOutput: document.querySelector('#interim'),
    startButton: document.querySelector('#start'),
    recognition: null,
  }
  if (window.webkitSpeechRecognition) {
    state.recognition = new webkitSpeechRecognition()
    state.recognition.continuous = true
    state.recognition.interimResults = true

    state.recognition.onstart = function() {
      state.recognizing = true
      console.log('speak now')
    }

    state.recognition.onend = function() {
      state.recognizing = false
      if (!state.final_transcript) {
        console.log('start')
        return
      }
      console.log('stop')
    }

    state.recognition.onresult = function(event) {
      state.interim_transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          state.final_transcript += event.results[i][0].transcript;
        } else {
          state.interim_transcript += event.results[i][0].transcript;
        }
      }
      let words = processWords(state)
      state.wordsOutput.innerHTML = styleWords(words)
      state.textOutput.innerHTML = state.final_transcript + state.interim_transcript
    }

    state.recognition.onerror = function(event) {
      state.recognizing = false
      state.startButton.innerHTML = 'start'
      if (event.error == 'no-speech') {
        console.log('no_speech');
      }
      if (event.error == 'audio-capture') {
        console.log('no_microphone')
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - state.start_timestamp < 100) {
          console.log('blocked')
        } else {
          console.log('denied')
        }
      }
    }
    state.startButton.addEventListener('click', function(event) {
      console.log('clicked start')
      if (!state.recognizing) {
        state.recognition.start()
        state.startButton.innerHTML = 'stop'
      } else {
        state.recognition.stop()
        state.startButton.innerHTML = 'start'
      }
    })
  } else {
    state.textOutput.innerHTML = `
      <h1>Your browser does not support this website</h1>
      <p>Try the latest Google Chrome</p>
    `
  }
}
