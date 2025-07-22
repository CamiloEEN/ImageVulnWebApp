import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:8000/login", {
      method: "POST",
      credentials: "include", // ⬅️ IMPORTANTE para que las cookies viajen
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Login exitoso");
          navigate("/account");
        }
      })
      .catch(err => console.error("Error:", err));
  };

  return (
    <>
    <Navbar />
    <div className='login-container'>
      <h2>Iniciar Sesión</h2>
      <form className='login-form' onSubmit={handleLogin}>
        <label htmlFor='email'>Email: </label>
        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" required />

        <label htmlFor='password'>Contraseña: </label>
        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />

        <button type='submit'>Entrar</button>

        <p>¿No tienes cuenta? <Link to='../register'>Regístrate aquí</Link></p>
      </form>
    </div>
    
    <Footer/>
    </>
  );
}

export default Login;