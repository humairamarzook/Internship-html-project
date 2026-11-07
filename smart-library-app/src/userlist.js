import { createElement as h, useEffect, useMemo, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from './firebase.js'

function UserList() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [isLoading, setIsLoading] = useState(Boolean(db))
  const [error, setError] = useState(db ? '' : 'Firebase is not configured. Add the Firebase values to .env.local and restart the app.')
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({ name: '', email: '', phone: '' })
  const [savingId, setSavingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [actionMessage, setActionMessage] = useState('')
  const [actionMessageType, setActionMessageType] = useState('success')

  useEffect(() => {
    if (!db) return undefined

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map((userDocument) => ({
        id: userDocument.id,
        ...userDocument.data(),
      })))
      setError('')
      setIsLoading(false)
    }, (snapshotError) => {
      console.error('Could not fetch registered users from Firestore.', snapshotError)
      setError('Could not load members. Check your Firestore read rules and internet connection.')
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return users
      .filter((user) => String(user.name ?? '').toLocaleLowerCase().includes(query))
      .sort((first, second) => {
        const firstValue = String(first[sortBy] ?? '')
        const secondValue = String(second[sortBy] ?? '')
        const order = firstValue.localeCompare(secondValue, undefined, { sensitivity: 'base' })
        return sortDirection === 'asc' ? order : -order
      })
  }, [users, search, sortBy, sortDirection])

  function changeSort(column) {
    if (sortBy === column) {
      setSortDirection((currentDirection) => currentDirection === 'asc' ? 'desc' : 'asc')
      return
    }
    setSortBy(column)
    setSortDirection('asc')
  }

  function sortHeading(column, label) {
    const isActive = sortBy === column
    const ariaSort = isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'
    const indicator = isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'

    return h('th', { scope: 'col', 'aria-sort': ariaSort },
      h('button', {
        className: 'user-sort-button',
        type: 'button',
        onClick: () => changeSort(column),
        'aria-label': `Sort by ${label} ${isActive && sortDirection === 'asc' ? 'descending' : 'ascending'}`,
      }, label, h('span', { 'aria-hidden': true }, indicator)),
    )
  }

  function startEditing(user) {
    setEditingId(user.id)
    setEditValues({
      name: String(user.name ?? ''),
      email: String(user.email ?? ''),
      phone: String(user.phone ?? ''),
    })
    setActionMessage('')
  }

  function changeEditValue(event) {
    const { name, value } = event.currentTarget
    setEditValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  function cancelEditing() {
    setEditingId(null)
    setEditValues({ name: '', email: '', phone: '' })
  }

  async function saveEdit(userId) {
    const name = editValues.name.trim()
    const email = editValues.email.trim()
    const phone = editValues.phone.trim()

    if (name.length < 3) {
      setActionMessageType('error')
      setActionMessage('Name must be at least 3 characters long.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setActionMessageType('error')
      setActionMessage('Enter a valid email address.')
      return
    }
    if (!/^\d{10}$/.test(phone)) {
      setActionMessageType('error')
      setActionMessage('Phone number must contain exactly 10 digits.')
      return
    }
    if (!db) {
      setActionMessageType('error')
      setActionMessage('Firebase is not configured. The member could not be updated.')
      return
    }

    setSavingId(userId)
    setActionMessage('')
    try {
      await updateDoc(doc(db, 'users', userId), { name, email, phone })
      setActionMessageType('success')
      setActionMessage('Member updated successfully.')
      cancelEditing()
    } catch (updateError) {
      console.error('Could not update the Firestore member.', updateError)
      setActionMessageType('error')
      setActionMessage('Could not update this member. Check Firestore rules and try again.')
    } finally {
      setSavingId(null)
    }
  }

  async function deleteUser(user) {
    const memberName = String(user.name ?? 'this member')
    const confirmed = window.confirm(`Delete ${memberName} from the member list? This cannot be undone.`)
    if (!confirmed) return
    if (!db) {
      setActionMessageType('error')
      setActionMessage('Firebase is not configured. The member could not be deleted.')
      return
    }

    setDeletingId(user.id)
    setActionMessage('')
    try {
      await deleteDoc(doc(db, 'users', user.id))
      setActionMessageType('success')
      setActionMessage(`${memberName} was deleted successfully.`)
      if (editingId === user.id) cancelEditing()
    } catch (deleteError) {
      console.error('Could not delete the Firestore member.', deleteError)
      setActionMessageType('error')
      setActionMessage('Could not delete this member. Check Firestore rules and try again.')
    } finally {
      setDeletingId(null)
    }
  }

  function renderUserRow(user) {
    const isEditing = editingId === user.id
    const isSaving = savingId === user.id
    const isDeleting = deletingId === user.id
    const isBusy = isSaving || isDeleting

    if (isEditing) {
      return h('tr', { key: user.id, className: 'user-editing-row' },
        h('td', null, h('input', {
          className: 'form-control form-control-sm user-edit-input',
          name: 'name',
          value: editValues.name,
          onChange: changeEditValue,
          'aria-label': 'Edit member name',
          minLength: 3,
          required: true,
        })),
        h('td', null, h('input', {
          className: 'form-control form-control-sm user-edit-input',
          name: 'email',
          type: 'email',
          value: editValues.email,
          onChange: changeEditValue,
          'aria-label': 'Edit member email',
          required: true,
        })),
        h('td', null, h('input', {
          className: 'form-control form-control-sm user-edit-input',
          name: 'phone',
          type: 'tel',
          value: editValues.phone,
          onChange: changeEditValue,
          'aria-label': 'Edit member phone',
          inputMode: 'numeric',
          pattern: '[0-9]{10}',
          maxLength: 10,
          required: true,
        })),
        h('td', null, h('div', { className: 'user-row-actions' },
          h('button', {
            className: 'btn btn-sm btn-success user-action-button is-save',
            type: 'button',
            onClick: () => saveEdit(user.id),
            disabled: isBusy,
            'aria-busy': isSaving,
          }, isSaving ? 'Saving…' : 'Save'),
          h('button', {
            className: 'btn btn-sm btn-outline-secondary user-action-button',
            type: 'button',
            onClick: cancelEditing,
            disabled: isBusy,
          }, 'Cancel'),
        )),
      )
    }

    return h('tr', { key: user.id },
      h('td', null, user.name || '—'),
      h('td', null, user.email || '—'),
      h('td', null, user.phone || '—'),
      h('td', null, h('div', { className: 'user-row-actions' },
        h('button', {
          className: 'btn btn-sm btn-outline-secondary user-action-button',
          type: 'button',
          onClick: () => startEditing(user),
          disabled: Boolean(savingId || deletingId),
        }, 'Edit'),
        h('button', {
          className: 'btn btn-sm btn-outline-danger user-action-button is-danger',
          type: 'button',
          onClick: () => deleteUser(user),
          disabled: Boolean(savingId || deletingId),
          'aria-busy': isDeleting,
        }, isDeleting ? 'Deleting…' : 'Delete'),
      )),
    )
  }

  return h('section', { className: 'page-wrap container-xl user-list-page' },
    h('div', { className: 'page-heading' },
      h('span', { className: 'eyebrow' }, 'Smart Library members'),
      h('h1', null, 'Registered readers.'),
      h('p', null, 'Browse the people who have joined the library. Search by name or sort the list by name and email.'),
    ),
    h('section', { className: 'user-list-card card shadow-sm', 'aria-labelledby': 'member-directory-title' },
      h('div', { className: 'user-list-toolbar card-header bg-transparent' },
        h('div', null,
          h('h2', { id: 'member-directory-title' }, 'Member directory'),
          h('p', null, `${users.length} ${users.length === 1 ? 'member' : 'members'}`),
        ),
        h('label', { className: 'user-search', htmlFor: 'member-search' },
          h('span', null, 'Search by name'),
          h('input', {
            id: 'member-search',
            type: 'search',
            className: 'form-control user-search-input',
            value: search,
            onChange: (event) => setSearch(event.target.value),
            placeholder: 'Type a member name',
            autoComplete: 'off',
          }),
        ),
      ),
      isLoading
        ? h('p', { className: 'user-list-message', role: 'status' },
          h('span', { className: 'user-list-spinner', 'aria-hidden': true }), 'Loading registered members…')
        : null,
      error ? h('p', { className: 'user-list-message is-error', role: 'alert' }, error) : null,
      actionMessage ? h('p', {
        className: `user-list-message user-action-message${actionMessageType === 'error' ? ' is-error' : ''}`,
        role: actionMessageType === 'error' ? 'alert' : 'status',
        'aria-live': 'polite',
      }, actionMessage) : null,
      !isLoading && !error && visibleUsers.length === 0
        ? h('p', { className: 'user-list-message', role: 'status' },
          users.length === 0 ? 'No registrations have been submitted yet.' : 'No members match that name.')
        : null,
      !isLoading && !error && visibleUsers.length > 0
        ? h('div', { className: 'table-responsive user-table-wrap' },
          h('table', { className: 'table table-hover align-middle mb-0 user-table' },
            h('thead', null,
              h('tr', null,
                sortHeading('name', 'Name'),
                sortHeading('email', 'Email'),
                h('th', { scope: 'col' }, 'Phone'),
                h('th', { scope: 'col' }, 'Actions'),
              ),
            ),
            h('tbody', null, visibleUsers.map(renderUserRow)),
          ),
        )
        : null,
    ),
  )
}

export default UserList
