import { Link } from '@tanstack/react-router'

import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-item">
          <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            📋 Recruitment Tracker
          </Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/applications">Aplikacje</Link>
        </div>
      </nav>
    </header>
  )
}
