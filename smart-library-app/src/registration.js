import { createElement as h, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase.js'

function Registration() {
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSaving) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()

    if (name.length < 3) {
      setMessageType('error')
      setMessage('Name must be at least 3 characters long.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessageType('error')
      setMessage('Enter a valid email address.')
      return
    }

    if (!/^\d{10}$/.test(phone)) {
      setMessageType('error')
      setMessage('Phone number must contain exactly 10 digits.')
      return
    }

    if (!db) {
      setMessageType('error')
      setMessage('Firebase is not configured. Please contact the app administrator.')
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      await addDoc(collection(db, 'users'), {
        name,
        email,
        phone,
        timestamp: serverTimestamp(),
      })
      setMessageType('success')
      setMessage(`Thanks, ${name}! Your registration was saved successfully.`)
      form.reset()
    } catch (error) {
      console.error('Could not save the registration to Firestore.', error)
      setMessageType('error')
      setMessage('We could not save your registration. Please try again.')
    } finally {
      setIsSaving(false)
    }
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
      h('form', { className: 'registration-form', onSubmit: handleSubmit, noValidate: true },
        h('label', { className: 'form-field', htmlFor: 'member-name' },
          'Full name', h('input', { id: 'member-name', name: 'name', type: 'text', placeholder: 'e.g. Alex Morgan', autoComplete: 'name', minLength: 3, required: true }),
        ),
        h('label', { className: 'form-field', htmlFor: 'member-email' },
          'Email address', h('input', { id: 'member-email', name: 'email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email', required: true }),
        ),
        h('label', { className: 'form-field', htmlFor: 'member-phone' },
          'Phone number', h('input', { id: 'member-phone', name: 'phone', type: 'tel', placeholder: '0771234567', autoComplete: 'tel', inputMode: 'numeric', pattern: '[0-9]{10}', maxLength: 10, required: true }),
        ),
        h('button', { className: 'button-primary form-submit', type: 'submit', disabled: isSaving, 'aria-busy': isSaving },
          isSaving ? h('span', { className: 'button-spinner', 'aria-hidden': true }) : null,
          isSaving ? 'Saving registration…' : 'Register',
        ),
        h('p', { className: `form-note${messageType === 'error' && message ? ' is-error' : ''}`, role: 'status', 'aria-live': 'polite' }, message),
      ),
    ),
  )
}

export default Registration
