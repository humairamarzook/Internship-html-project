import { createElement as h, useState } from 'react'

function Registration() {
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const name = new FormData(form).get('name').trim()
    setMessage(`Thanks, ${name}! Your registration form is ready.`)
    form.reset()
  }

  return h('section', { className: 'page-wrap' },
    h('div', { className: 'page-heading' },
      h('span', { className: 'eyebrow' }, 'Become a member'),
      h('h1', null, 'Your reading journey starts here.'),
      h('p', null, 'Create your library profile with a couple of details. We’ll be glad to have you with us.'),
    ),
    h('div', { className: 'registration-card' },
      h('aside', { className: 'form-aside' },
        h('h2', null, 'A little more room for stories.'),
        h('p', null, 'Join a community that makes it easier to discover, enjoy, and return to the books you love.'),
        h('span', { className: 'aside-number', 'aria-hidden': true }, '01 / 03'),
      ),
      h('form', { className: 'registration-form', onSubmit: handleSubmit },
        h('label', { className: 'form-field', htmlFor: 'member-name' },
          'Full name', h('input', { id: 'member-name', name: 'name', type: 'text', placeholder: 'e.g. Alex Morgan', autoComplete: 'name', required: true }),
        ),
        h('label', { className: 'form-field', htmlFor: 'member-email' },
          'Email address', h('input', { id: 'member-email', name: 'email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email', required: true }),
        ),
        h('button', { className: 'button-primary form-submit', type: 'submit' }, 'Register'),
        h('p', { className: 'form-note', role: 'status', 'aria-live': 'polite' }, message),
      ),
    ),
  )
}

export default Registration
