import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Editor from './pages/Editor';
import Explore from './pages/Explore';
import ChangePassword from './pages/ChangePassword'
import EditProfile from './pages/EditProfile'
import NotFound from './pages/NotFound';

import './App.css'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path='*' element= {<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App
