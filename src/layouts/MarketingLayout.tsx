import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Footer from '../components/navigation/Footer'

export default function MarketingLayout() {
  return (
    <div className="marketing-layout">
      <Navbar />
      <main className="marketing-main" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
