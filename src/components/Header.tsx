import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-4 flex gap-2 bg-white text-black justify-between border-b border-gray-200">
      <nav className="flex flex-row gap-6 items-center">
        <div>
          <Link to="/" className="text-xl font-bold no-underline hover:text-blue-600 transition-colors">
            📋 Recruitment Tracker
          </Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/dashboard" className="no-underline hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/applications" className="no-underline hover:text-blue-600 transition-colors">
            Aplikacje
          </Link>
        </div>
      </nav>
    </header>
  )
}
