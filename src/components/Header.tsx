import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'

export default function Header() {
  return (
    <header className="p-4 flex gap-2 bg-background border-b border-border justify-between items-center sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-row gap-6 items-center">
        <div>
          <Link to="/" className="text-xl font-bold no-underline hover:text-primary transition-colors">
            📋 Recruitment Tracker
          </Link>
        </div>

        <div className="px-2 font-bold">
          <Link 
            to="/dashboard" 
            className="no-underline hover:text-primary transition-colors"
            activeProps={{ className: 'text-primary' }}
          >
            Dashboard
          </Link>
        </div>

        <div className="px-2 font-bold">
          <Link 
            to="/applications" 
            className="no-underline hover:text-primary transition-colors"
            activeProps={{ className: 'text-primary' }}
          >
            Aplikacje
          </Link>
        </div>
      </nav>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
