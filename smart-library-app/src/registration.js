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

  return h('section', { className: 'page-wrap container-xl' },
    h('div', { className: 'page-heading' },
      h('span', { className: 'eyebrow' }, 'Become a member'),
      h('h1', null, 'Your reading journey starts here.'),
      h('p', null, 'Create your library profile with a couple of details. We’ll be glad to have you with us.'),
    ),
    h('div', { className: 'registration-card card shadow-sm' },
      h('aside', { className: 'form-aside card-body' },
        h('h2', null, 'A little more room for stories.'),
        h('p', null, 'Join a community that makes it easier to discover, enjoy, and return to the books you love.'),
        h('span', { className: 'aside-number', 'aria-hidden': true }, '01 / 03'),
      ),
      h('form', { className: 'registration-form card-body', onSubmit: handleSubmit, noValidate: true },
        h('div', { className: 'form-field' },
          h('label', { className: 'form-label', htmlFor: 'member-name' }, 'Full name'),
          h('input', { className: 'form-control', id: 'member-name', name: 'name', type: 'text', placeholder: 'e.g. Amara Perera', autoComplete: 'name', 'aria-describedby': 'member-name-help', minLength: 3, required: true }),
          h('small', { className: 'form-text', id: 'member-name-help' }, 'Use at least 3 characters.'),
        ),
        h('div', { className: 'form-field' },
          h('label', { className: 'form-label', htmlFor: 'member-email' }, 'Email address'),
          h('input', { className: 'form-control', id: 'member-email', name: 'email', type: 'email', placeholder: 'name@example.com', autoComplete: 'email', 'aria-describedby': 'member-email-help', required: true }),
          h('small', { className: 'form-text', id: 'member-email-help' }, 'Use a valid email address.'),
        ),
        h('div', { className: 'form-field' },
          h('label', { className: 'form-label', htmlFor: 'member-phone' }, 'Phone number'),
          h('input', { className: 'form-control', id: 'member-phone', name: 'phone', type: 'tel', placeholder: '0771234567', autoComplete: 'tel', inputMode: 'numeric', pattern: '[0-9]{10}', 'aria-describedby': 'member-phone-help', maxLength: 10, required: true }),
          h('small', { className: 'form-text', id: 'member-phone-help' }, 'Enter exactly 10 digits, without spaces.'),
        ),
        h('button', { className: 'button-primary btn btn-success form-submit', type: 'submit', disabled: isSaving, 'aria-busy': isSaving },
          isSaving ? h('span', { className: 'button-spinner', 'aria-hidden': true }) : null,
          isSaving ? 'Saving registration…' : 'Register',
        ),
        h('p', {
          className: `form-note${message ? ` alert ${messageType === 'error' ? 'alert-danger is-error' : 'alert-success'}` : ''}`,
          role: messageType === 'error' ? 'alert' : 'status',
          'aria-live': 'polite',
        }, message),
      ),
    ),
  )
}

export default Registration
