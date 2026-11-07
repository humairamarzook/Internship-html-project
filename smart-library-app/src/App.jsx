import { useState } from 'react'
import Home from './home.js'
import Registration from './registration.js'
import About from './about.js'
import './App.css'

const pages = { home: Home, registration: Registration, about: About }

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const Screen = pages[currentPage]

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
          <button className="nav-cta" onClick={() => setCurrentPage('registration')}>Join the library</button>
        </nav>
      </header>
      <main><Screen onNavigate={setCurrentPage} /></main>
      <footer className="site-footer">
        <span>Smart Library</span>
        <span>Read more. Discover more.</span>
      </footer>
    </div>
  )
}

export default App
