import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Menu, X } from 'lucide-react'

const navItems = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', name: 'Projects', icon: FolderKanban }
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mobile-nav">
      <button
        className="mobile-nav-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      {open && (
        <nav className="mobile-nav-menu">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'mobile-nav-item mobile-nav-item--active' : 'mobile-nav-item'
              }
              onClick={() => setOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
