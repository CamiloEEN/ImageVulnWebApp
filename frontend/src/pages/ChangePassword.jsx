import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from "react";
import './ChangePassword.css';

import { useNavigate } from 'react-router-dom';

function ChangePassword(){

    const [actualPassword, setActualPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [msg, setMsg] = useState("");

    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    fetch("http://localhost:8000/me", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          navigate("/login");
        } else {
          return res.json();
        }
      })
      .then(data => setUserData(data))
      .catch(() => navigate("/login"));
  }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMsg("Las contraseñas nuevas no coinciden");
      return;
    }

    const res = await fetch("http://localhost:8000/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        current_password: actualPassword,
        new_password: newPassword
      }),
    });

    const data = await res.json();

    //if (res) return <p>Cargando datos del usuario... {userData}</p>;
    if (data.error){
      alert(data.error);
    }
    else {
      alert("Cambio exitoso");
      navigate("/account");
    }

    setMsg(data.message || data.error);
  };

    return (
    <>
    <Navbar />
    <div className='change-password-container'>
    <form className='change-password-form' onSubmit={handleSubmit}>
      <h2>Cambiar contraseña</h2>
      <input type="password" name="current" value={actualPassword} placeholder="Contraseña actual" onChange={e => setActualPassword(e.target.value)} required />
      <input type="password" name="new1" value={newPassword} placeholder="Nueva contraseña" onChange={e => setNewPassword(e.target.value)} required />
      <input type="password" name="new2" value={confirmNewPassword} placeholder="Confirmar nueva contraseña" onChange={e => setConfirmNewPassword(e.target.value)} required />
      <button type="submit">Actualizar</button>
      <p color='red'>{msg}</p>
    </form>
    </div>
    <Footer/>
    </>
  );
}

export default ChangePassword;