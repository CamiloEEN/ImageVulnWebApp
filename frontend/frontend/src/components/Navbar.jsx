import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
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
