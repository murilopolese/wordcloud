const html = require('choo/html')

const Accordion = (props, children) => {
  let { title, open, onToggle, disabled } = props
  return html`
    <div class="accordion ${disabled ? 'disabled' : ''}">
      <div class="title" onclick=${!disabled ? onToggle : null}>
        <h2>${title}</h2>
        <button>${open ? '-' : '+'}</button>
      </div>
      <div class="content ${open ? 'open' : 'closed'}">${children}</div>
    </div>
  `
}

module.exports = Accordion
