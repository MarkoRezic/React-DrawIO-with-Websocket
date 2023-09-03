import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css';
import { Board } from './components/board/Board';
import Lobby from './components/lobby/Lobby';
import Login from './components/auth/Login';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Lobby />} />
        <Route path='/' element={<Lobby />} />
        <Route path='public' element={<Board public={true} />} />
        <Route path='room/:room_id' element={<Board />} />
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
      />
    </BrowserRouter>
  );
}

export default App;
