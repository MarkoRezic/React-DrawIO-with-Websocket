import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css';
import Lobby from './components/lobby/Lobby';
import Login from './components/auth/Login';
import { ToastContainer } from 'react-toastify';
import Game from './components/game/Game';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Lobby />} />
        <Route path='/' element={<Lobby />} />
        <Route path='/room/:room_id' element={<Game />} />
      </Routes>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        limit={3}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        toastStyle={{ backgroundColor: 'rgba(70, 70, 70, 0.85)' }}
      />
    </BrowserRouter>
  );
}

export default App;
