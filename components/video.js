const html = require('choo/html')

const Video = (state, emit) => {
  return html`
    <div>
      ${VideoControls(state, emit)}
      ${VideoPlayer(state, emit)}
    </div>
  `
}

const VideoControls = (state, emit) => {
  const onChange = (e) => emit('loadVideo', e.target.value)
  return html`
    <div class="video-controls">
      <input type="text" value=${state.videoUrl||''} onkeyup=${onChange} />
      <button>Load video</button>
      ${state.videoError}
    </div>
  `
}
const VideoPlayer = (state, emit) => {
  if (state.videoId) {
    return html`
    <div class="video-player">
      <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${state.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    `
  } else {
    return html`
      <div class="video-player"></div>
    `
  }
}

module.exports = Video
