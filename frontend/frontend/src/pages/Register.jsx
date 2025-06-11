import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './Register.css'

function Register() {
  return (
    <>
    <Navbar />

    <div className='register-container'>
      <h2>Crea una cuenta</h2>
      <form className='register-form'>

        {/* <label htmlFor='nickname'>Nombre de usuario o apodo: </label> */}
        <input type='text' id='nickname' name='nickname' placeholder='Nombre de usuario o apodo' required></input>

        {/* <label htmlFor='username'>Nombres: </label> */}
        <input type='text' id='username' name='username' placeholder='Nombres' required></input>

        {/* <label htmlFor='usersurname'>Apellido: </label> */}
        <input type='text' id='usersurname' name='usersurname' placeholder='Apellidos' required></input>

        {/* <label htmlFor='email'>correo: </label> */}
        <input type='email' id='email' name='email' placeholder='email' required></input>

        {/* <label htmlFor='password'>contraseña: </label> */}
        <input type='password' id='password' name='password' placeholder='Contraseña' required></input>

         {/* <label htmlFor='password'>contraseña: </label> */}
        <input type='password' id='password' name='password' placeholder='Confirmar contraseña' required></input>

        <button type='submit' >Registrarse</button>
        <p>¿Ya tienes una cuenta? <Link to='../login'>Inicia sesión</Link></p>
      </form>
    </div>

    <Footer/>
    </>
  );
}

export default Register;