import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Sidebar from '../components/navigation/Sidebar'
import MobileNav from '../components/navigation/MobileNav'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <MobileNav />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
