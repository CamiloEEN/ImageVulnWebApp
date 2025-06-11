import { Link } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
  return (
    <nav className='navbar'>
      <ul className='navbar-links'>
        <li><Link to="/">Inicio</Link></li>
         <li><Link to="/login">Login/Registarse</Link></li>
        <li><Link to="/explore">Trabajos de la comunidad</Link></li>
        <li><Link to="/editor">Editor de imágenes</Link></li>
        <li><Link to="/account">Cuenta</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
