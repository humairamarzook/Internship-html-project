import { createElement as h, useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase.js'

function UserList() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!db) {
      setError('Firebase is not configured. Add the Firebase values to .env.local and restart the app.')
      setIsLoading(false)
      return undefined
    }

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

  return h('section', { className: 'page-wrap user-list-page' },
    h('div', { className: 'page-heading' },
      h('span', { className: 'eyebrow' }, 'Smart Library members'),
      h('h1', null, 'Registered readers.'),
      h('p', null, 'Browse the people who have joined the library. Search by name or sort the list by name and email.'),
    ),
    h('section', { className: 'user-list-card', 'aria-labelledby': 'member-directory-title' },
      h('div', { className: 'user-list-toolbar' },
        h('div', null,
          h('h2', { id: 'member-directory-title' }, 'Member directory'),
          h('p', null, `${users.length} ${users.length === 1 ? 'member' : 'members'}`),
        ),
        h('label', { className: 'user-search', htmlFor: 'member-search' },
          h('span', null, 'Search by name'),
          h('input', {
            id: 'member-search',
            type: 'search',
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
      !isLoading && !error && visibleUsers.length === 0
        ? h('p', { className: 'user-list-message', role: 'status' },
          users.length === 0 ? 'No registrations have been submitted yet.' : 'No members match that name.')
        : null,
      !isLoading && !error && visibleUsers.length > 0
        ? h('div', { className: 'user-table-wrap' },
          h('table', { className: 'user-table' },
            h('thead', null,
              h('tr', null,
                sortHeading('name', 'Name'),
                sortHeading('email', 'Email'),
                h('th', { scope: 'col' }, 'Phone'),
              ),
            ),
            h('tbody', null, visibleUsers.map((user) => h('tr', { key: user.id },
              h('td', null, user.name || '—'),
              h('td', null, user.email || '—'),
              h('td', null, user.phone || '—'),
            ))),
          ),
        )
        : null,
    ),
  )
}

export default UserList
