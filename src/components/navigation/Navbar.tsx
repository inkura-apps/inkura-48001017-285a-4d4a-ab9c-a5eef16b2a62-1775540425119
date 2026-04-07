import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">App</span>
        </Link>
        <nav className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        </nav>
        <div className="navbar-actions">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/signup" className="btn btn-primary">Sign up</Link>
        </div>
      </div>
    </header>
  )
}
