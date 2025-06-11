import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './Login.css'

function Login() {
  return (
    <>
    <Navbar />
    <div className='login-container'>
      <h2>Iniciar Sesión</h2>
      <form className='login-form'>
        <label htmlFor='username'>Usuario: </label>
        <input type='text' id='username' name='username' required></input>

        <label htmlFor='password'>Contraseña: </label>
        <input type='password' id='password' name='password' required></input>

        <button type='submit'>Entrar</button>

        <p>¿No tienes cuenta? <Link to='../register'>Regístrate aquí</Link></p>
      </form>
    </div>
    
    <Footer/>
    </>
  );
}

export default Login;