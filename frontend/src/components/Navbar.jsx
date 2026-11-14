import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  // A helper function to style active vs inactive links
  const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-all duration-300 relative group ${
        isActive ? 'text-blue-400' : 'text-slate-300 hover:text-white'
    }`

  return (
    <nav className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo / Home Link */}
        <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition">
          Abandoned but Not Forgotten
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/series" className={linkClass}>Series</NavLink>
          <NavLink to="/stories" className={linkClass}>Stories</NavLink>
          <NavLink to="/images" className={linkClass}>Images</NavLink>
          <NavLink to="/certificates" className={linkClass}>Certificates</NavLink>
        </div>
        
      </div>
    </nav>
  )
}