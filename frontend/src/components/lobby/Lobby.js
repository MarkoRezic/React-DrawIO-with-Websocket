import React, { useState } from 'react';
import avatars from './avatars';
import TITLE_IMG from '../../img/title.svg'
import io from 'socket.io-client';

import './style.css';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
    const [username, setUsername] = useState(sessionStorage.getItem('username') ?? '')
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[parseInt(sessionStorage.getItem('avatar') ?? '0')])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const updateUsername = (e) => {
        setUsername(e.target.value)
        sessionStorage.setItem('username', e.target.value)
    }

    const selectAvatar = (avatarIndex) => {
        setSelectedAvatar(avatars[avatarIndex])
        sessionStorage.setItem('avatar', avatarIndex.toString())
    }

    const btnEnabled = username.trim() !== ''

    const joinPublicRoom = () => {
        navigate('/public')
    }

    const createPrivateRoom = () => {

    }


    return (
        <div id="lobby">
            <div id='lobby-title'>
                <img src={TITLE_IMG} />
            </div>
            <div id='lobby-avatars-container'>
                {
                    avatars.map((avatar, avatarIndex) =>
                        <div className={'lobby-avatar' + (avatar == selectedAvatar ? ' selected-avatar' : '')}
                            onClick={() => { selectAvatar(avatarIndex) }}>
                            <img src={avatar.img} />
                        </div>
                    )
                }
            </div>
            <div id='lobby-input-container'>
                <label>NADIMAK</label>
                <input type='text' placeholder='Unesite naziv' value={username} onChange={updateUsername} />
            </div>
            <button id='btn-play' className={'btn btn-primary btn-large' + (btnEnabled ? '' : ' btn-disabled')} onClick={joinPublicRoom}>Igraj</button>
            <button id='btn-private-room' className={'btn btn-secondary btn-large' + (btnEnabled ? '' : ' btn-disabled')}>Kreiraj privatnu sobu</button>
        </div>
    )
}

export default Lobby;