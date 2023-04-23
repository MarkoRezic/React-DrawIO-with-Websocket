import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css';
import { Board } from './components/board/Board';
import Lobby from './components/lobby/Lobby';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Lobby />} />
        <Route path='public' element={<Board public={true} />} />
        <Route path='room/:room_id' element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
