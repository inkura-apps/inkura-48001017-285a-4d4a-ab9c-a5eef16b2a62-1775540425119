import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderKanban } from 'lucide-react'

const navItems = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', name: 'Projects', icon: FolderKanban }
]

export default function Sidebar() {
  return (
    <aside className="sidebar" style={{ width: '256px' }}>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-item sidebar-item--active' : 'sidebar-item'
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
