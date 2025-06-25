import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Account.css'

import { useEffect, useState } from "react";

function Account() {

  const [userData, setUserData] = useState(null);

  // Por ahora asumimos que el id del usuario es 1 (más adelante vendrá del login)
  const userId = 4;

  useEffect(() => {
    fetch(`http://localhost:8000/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos del backend:", data);  // 👀 VERIFICACIÓN
        setUserData(data)
      })
      .catch(error => console.error("Error:", error));
  }, [userId]);

  if (!userData) return <p>Cargando datos del usuario... {userData}</p>;

  const testuser = {
    nickname: 'Noland',
    accountID: '1234',
    username: 'No',
    usersurname: 'Land',
    email: 'noland@noemail.com',
    registered: '2025-06-01',
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
        <button className='logout'>Cerrar sesión</button>
      </div>

    </div>
    <Footer/>
    </>
  );
}

export default Account;
