import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Account.css'

function Account() {

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
        <p><strong>Usuario:</strong> {testuser.nickname}</p>
        <p><strong>ID:</strong> {testuser.accountID}</p>
        <p><strong>Nombres:</strong> {testuser.username}</p>
        <p><strong>Apellidos:</strong> {testuser.usersurname}</p>
        <p><strong>Fecha de registro:</strong> {testuser.registered}</p>
      </div>
      <div className='account-contact'>
        <p><strong>email:</strong> {testuser.email}</p>
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
