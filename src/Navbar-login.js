import { Link, useResolvedPath, useMatch } from "react-router-dom"
import './Navbar-login.css';

export default function LNavbar() {
  const path = window.location.pathname;
  return (
    <nav className="nav">
      <Link to="/" className="site-title">IT Facilities Reservation</Link>
      <ul>
        <li><Link to="/Home">Home</Link></li>
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/FAQs">FAQs</Link></li>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props}) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>{children}</Link>
    </li>
  )
}