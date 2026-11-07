import { createElement as h } from 'react'

function Home({ onNavigate }) {
  return h('section', { className: 'home-page' },
    h('div', { className: 'hero-copy' },
      h('span', { className: 'eyebrow' }, 'A place for curious minds'),
      h('h1', null, 'Find your next ', h('em', null, 'great read.'), ' Make room for discovery.'),
      h('p', null, 'Welcome to Smart Library, a calm and friendly space to explore books, share your interests, and make reading part of every day.'),
      h('div', { className: 'hero-actions' },
        h('button', { className: 'button-primary', onClick: () => onNavigate('registration') }, 'Create your account'),
        h('button', { className: 'text-link', onClick: () => onNavigate('userlist') }, 'Browse members ↗'),
        h('button', { className: 'text-link', onClick: () => onNavigate('about') }, 'About the project ↗'),
      ),
    ),
    h('div', { className: 'hero-art', role: 'img', 'aria-label': 'Illustration of books in a library' },
      h('div', { className: 'sun-disc' }),
      h('div', { className: 'book-stack' },
        h('div', { className: 'book book-one' }),
        h('div', { className: 'book book-two' }, h('span', { className: 'book-spine' })),
        h('div', { className: 'book book-three' }, h('span', { className: 'book-label' }, 'Stories & ideas')),
      ),
      h('div', { className: 'art-leaf' }),
      h('span', { className: 'art-caption' }, 'Open a world of possibilities'),
    ),
  )
}

export default Home
