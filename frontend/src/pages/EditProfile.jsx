import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from "react";
import './EditProfile.css';

import { useNavigate } from 'react-router-dom';

function EditProfile(){
    const [nickname, setNickname] = useState("");
    const [username, setUsername] = useState("");
    const [usersurname, setUsersurname] = useState("");
    const [email, setEmail] = useState("");

    const [msg, setMsg] = useState("");
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    //Acces only if you are autenticated
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
    const res = await fetch("http://localhost:8000/edit-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        new_nickname: nickname,
        new_username: username,
        new_usersurname: usersurname,
        new_email: email
        }),
    });

    const data = await res.json();

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
    <div className='edit-profile-container'>
        <form className='edit-profile-form' onSubmit={handleSubmit}>
            <h2>Editar perfil</h2>
            <input name="nickname" value={nickname} onChange={e =>setNickname(e.target.value)} placeholder='nickname'/>
            <input name="username" value={username} onChange={e =>setUsername(e.target.value)} placeholder='username'/>
            <input name="usersurname" value={usersurname} onChange={e =>setUsersurname(e.target.value)} placeholder='usersurname'/>
            <input name="email" value={email} onChange={e =>setEmail(e.target.value)} placeholder='email'/>
            <button type="submit">Guardar cambios</button>
            <p>{msg}</p>
        </form>
    </div>
    <Footer/>
    </>
  );
}

export default EditProfile;