import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './Register.css'

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [usersurname, setUsersurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, username, usersurname, email, password})
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert("Error: " + data.error);
        } else {
          alert("Registro exitoso");
          navigate("/login");
        }
      })
      .catch(err => console.error("Error:", err));
  };


  return (
    <>
    <Navbar />

    <div className='register-container'>
      <h2>Crea una cuenta</h2>
      <form className='register-form' onSubmit={handleRegister}>

        {/* <label htmlFor='nickname'>Nombre de usuario o apodo: </label> */}
        <input type='text' id='nickname' name='nickname' onChange={e => setNickname(e.target.value)} placeholder='Nombre de usuario o apodo' required></input>

        {/* <label htmlFor='username'>Nombres: </label> */}
        <input type='text' id='username' name='username' onChange={e => setUsername(e.target.value)} placeholder='Nombres' required></input>

        {/* <label htmlFor='usersurname'>Apellido: </label> */}
        <input type='text' id='usersurname' name='usersurname' onChange={e => setUsersurname(e.target.value)} placeholder='Apellidos' required></input>

        {/* <label htmlFor='email'>correo: </label> */}
        <input type='email' id='email' name='email' onChange={e => setEmail(e.target.value)} placeholder='email' required></input>

        {/* <label htmlFor='password'>contraseña: </label> */}
        <input type='password' id='password' name='password' onChange={e => setPassword(e.target.value)} placeholder='Contraseña' required></input>

         {/* <label htmlFor='password'>contraseña: </label> */}
        <input type='password' id='password' name='password' onChange={e => setConfirmPassword(e.target.value)} placeholder='Confirmar contraseña' required></input>

        <button type='submit' >Registrarse</button>
        <p>¿Ya tienes una cuenta? <Link to='../login'>Inicia sesión</Link></p>
      </form>
    </div>

    <Footer/>
    </>
  );
}

export default Register;