import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Account.css'

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Account() {

  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Por ahora asumimos que el id del usuario es 1 (más adelante vendrá del login)
  const userId = 4;

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

  if (!userData) return <p>Cargando datos del usuario... {userData}</p>;

 const handleLogout = async () => {
  try {
    const response = await fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      // Limpiar cualquier estado del usuario si lo guardas en frontend
      navigate("/login");  // Redirigir al login después del logout
    } else {
      console.error("Error al cerrar sesión");
    }
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
  }
};


  return (
    <>
    <Navbar />
    <div className='account-container'>
      <h2>Mi cuenta</h2>
      <div className='account-info'>
        <p><strong>Usuario:</strong> {userData.nickname}</p>
        <p><strong>Account ID:</strong> {userData.id}</p>
        <p><strong>Nombres:</strong> {userData.username}</p>
        <p><strong>Apellidos:</strong> {userData.usersurname}</p>
        <p><strong>Fecha de registro:</strong> {new Date(userData.created_at).toLocaleString()}</p>
      </div>
      <div className='account-contact'>
        <p><strong>email:</strong> {userData.email}</p>
      </div>
      <div className='account-buttons'>
        <button>Editar perfil</button>
        <button>Cambiar contraseña</button>
        <button className='logout' onClick={handleLogout}>Cerrar sesión</button>
      </div>

    </div>
    <Footer/>
    </>
  );
}

export default Account;
