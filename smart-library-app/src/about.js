import { createElement as h } from 'react'

function About() {
  return h('section', { className: 'page-wrap container-xl' },
    h('div', { className: 'page-heading' },
      h('span', { className: 'eyebrow' }, 'About this application'),
      h('h1', null, 'A simpler way to make space for reading.'),
      h('p', null, 'Smart Library is a small learning project that brings a welcoming library experience to the web.'),
    ),
    h('div', { className: 'about-grid' },
      h('article', { className: 'about-card card featured' },
        h('h2', null, 'The idea'),
        h('p', null, 'This application introduces a digital library experience where readers can learn about the project and register their interest through a clear, approachable interface.'),
      ),
      h('article', { className: 'about-card card' },
        h('h2', null, 'Built for learning'),
        h('p', null, 'The front end is built with React, and Firebase Firestore stores member registrations for the directory.'),
      ),
    ),
  )
}

export default About
