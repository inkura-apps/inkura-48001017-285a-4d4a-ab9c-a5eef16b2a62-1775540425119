import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <main className="auth-main" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
