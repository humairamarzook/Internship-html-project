import { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import Home from './home.js'
import Registration from './registration.js'
import About from './about.js'
import UserList from './userlist.js'
import { auth } from './firebase.js'
import './App.css'

const pages = { home: Home, registration: Registration, about: About, userlist: UserList }

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [authUser, setAuthUser] = useState(null)
  const [authReady, setAuthReady] = useState(!auth)
  const [authMessage, setAuthMessage] = useState('')

  useEffect(() => {
    if (!auth) return undefined

    return onAuthStateChanged(auth, (user) => {
      setAuthUser(user)
      setAuthReady(true)
      if (!user) setCurrentPage((page) => page === 'userlist' ? 'home' : page)
    })
  }, [])

  async function openMembers() {
    setAuthMessage('')
    if (!auth) {
      setAuthMessage('Firebase is not configured, so administrator sign-in is unavailable.')
      return
    }

    try {
      if (!authUser) await signInWithPopup(auth, new GoogleAuthProvider())
      setCurrentPage('userlist')
    } catch (error) {
      console.error('Could not sign in to the member directory.', error)
      setAuthMessage(error.code === 'auth/operation-not-allowed'
        ? 'Enable Google sign-in in Firebase Authentication, then try again.'
        : 'Sign-in did not complete. Please try again with the administrator Google account.')
    }
  }

  async function handleSignOut() {
    if (!auth) return
    try {
      await signOut(auth)
      setCurrentPage('home')
      setAuthMessage('You are signed out.')
    } catch (error) {
      console.error('Could not sign out of the member directory.', error)
      setAuthMessage('Sign-out did not complete. Please try again.')
    }
  }

  function navigate(page) {
    if (page === 'userlist') {
      void openMembers()
      return
    }
    setCurrentPage(page)
  }

  const Screen = currentPage === 'userlist' && authUser ? UserList : currentPage === 'userlist' ? Home : pages[currentPage]

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" onClick={() => setCurrentPage('home')}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Smart Library</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <button className={currentPage === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => setCurrentPage('home')}>Home</button>
          <button className={currentPage === 'about' ? 'nav-link active' : 'nav-link'} onClick={() => setCurrentPage('about')}>About</button>
          <button className={currentPage === 'userlist' ? 'nav-link active' : 'nav-link'} onClick={() => void openMembers()}>Members</button>
          <button className="nav-cta" onClick={() => setCurrentPage('registration')}>Join the library</button>
          {authUser
            ? <button className="nav-link auth-nav-button" onClick={() => void handleSignOut()}>Sign out</button>
            : <button className="nav-link auth-nav-button" disabled={!authReady} onClick={() => void openMembers()}>{authReady ? 'Admin sign in' : 'Checking sign-in…'}</button>}
        </nav>
      </header>
      {authMessage ? <p className="auth-feedback" role="status" aria-live="polite">{authMessage}</p> : null}
      <main><Screen onNavigate={navigate} /></main>
      <footer className="site-footer">
        <span>Smart Library</span>
        <span>Read more. Discover more.</span>
      </footer>
    </div>
  )
}

export default App
