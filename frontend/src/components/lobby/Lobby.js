import React, { useState } from 'react';
import avatars from './avatars';
import TITLE_IMG from '../../img/title.svg'

import './style.css';

const Lobby = () => {
    const [username, setUsername] = useState(localStorage.getItem('username') ?? '')
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[parseInt(localStorage.getItem('avatar') ?? '0')])

    const updateUsername = (e) => {
        setUsername(e.target.value)
        localStorage.setItem('username', e.target.value)
    }

    const selectAvatar = (avatarIndex) => {
        setSelectedAvatar(avatars[avatarIndex])
        localStorage.setItem('avatar', avatarIndex.toString())
    }

    const btnEnabled = username.trim() !== ''


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
            <button id='btn-play' className={'btn btn-primary btn-large' + (btnEnabled ? '' : ' btn-disabled')}>Igraj</button>
            <button id='btn-private-room' className={'btn btn-secondary btn-large' + (btnEnabled ? '' : ' btn-disabled')}>Kreiraj privatnu sobu</button>
        </div>
    )
}

export default Lobby;