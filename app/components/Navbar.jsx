import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className="navbar bg-base-500 h-5">
  <div className="navbar-start">
   
    <Link to="/" className="btn btn-ghost text-xl">ResumeLens</Link>
  </div>
  
  <div className="navbar-end">
    <Link to="/upload" className="btn">Upload Resume</Link>
  </div>
</nav>
  )
}

export default Navbar
