import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom'
import './App.css';
import Lobby from './components/lobby/Lobby';
import Login from './components/auth/Login';
import { ToastContainer } from 'react-toastify';
import Game from './components/game/Game';
import MusicPlayer from './components/common/MusicPlayer';
import { DataContext } from './Context';
import SettingsModal from './components/common/SettingsModal';
import SCORE_IMG from './img/score_button.svg'
import SETTINGS_IMG from './img/settings_button.svg'
import ScoresModal from './components/common/ScoresModal';

const App = () => {
  const context = useContext(DataContext)
  return (
    <>
      <MusicPlayer />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Lobby />} />
        <Route path='/' element={<Lobby />} />
        <Route path='/room/:room_id' element={<Game />} />
      </Routes>

      <div id='score-settings-container'>
        <div id='open-score-button' onClick={context?.openScores}>
          <img src={SCORE_IMG} />
        </div>
        <div id='open-settings-button' onClick={context?.openSettings}>
          <img src={SETTINGS_IMG} />
        </div>
      </div>

      {context?.showSettings ? <SettingsModal /> : null}
      {context?.showScores ? <ScoresModal /> : null}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        limit={3}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover={false}
        theme="dark"
        toastStyle={{ backgroundColor: 'rgba(70, 70, 70, 0.85)' }}
      />
    </>
  );
}

export default App;
