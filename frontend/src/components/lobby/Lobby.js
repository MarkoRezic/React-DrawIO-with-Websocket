import React, { useContext, useEffect, useState } from 'react';
import avatars from '../common/avatars';
import TITLE_IMG from '../../img/title.svg'
import io from 'socket.io-client';
import { uuid } from 'uuidv4'

import './style.css';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';
import useDebounce from '../../utils/use_debounce';

const Lobby = () => {
    const context = useContext(DataContext)
    const [username, setUsername] = useState(context?.user?.username ?? '')
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[context?.user?.avatar ?? 0])
    const [loadingUsername, setLoadingUsername] = useState(false)
    const [loadingAvatar, setLoadingAvatar] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (context?.user?.username != null) {
            setUsername(context?.user?.username)
        }
    }, [context?.user?.username])

    useEffect(() => {
        if (context?.user?.avatar != null) {
            setSelectedAvatar(avatars[context?.user?.avatar])
        }
    }, [context?.user?.avatar])

    const updateUsername = (e) => {
        setUsername(e.target.value)
        setLoadingUsername(true)
        debouncedUpdateUsername(e.target.value,
            (response) => {
                toast('Korisničko ime ažurirano', { type: 'success' })
                setLoadingUsername(false)
            }, (errorCode) => {
                if (errorCode === 400) {
                    toast('Korisničko ime je već zauzeto', { type: 'error' })
                }
                else {
                    toast('Pogreška na serveru', { type: 'error' })
                }
                setLoadingUsername(false)
            })
    }
    const debouncedUpdateUsername = useDebounce(context.updateUsername, 700)
    const debouncedUpdateAvatar = useDebounce(context.updateAvatar, 700)

    const selectAvatar = (avatarIndex) => {
        setSelectedAvatar(avatars[avatarIndex])
        setLoadingAvatar(true)
        debouncedUpdateAvatar(avatarIndex,
            (response) => {
                toast('Avatar ažuriran', { type: 'success' })
                setLoadingAvatar(false)
            }, (errorCode) => {
                toast('Pogreška na serveru', { type: 'error' })
                setLoadingAvatar(false)
            })
    }

    const btnEnabled = username.trim() !== ''

    const joinPublicRoom = () => {
        navigate('/room/public')
    }

    const createPrivateRoom = () => {
        const room_id = uuid();
        navigate(`/room/${room_id}`)
    }

    const logout = () => {
        context.logout()
    }


    return (
        <div id="lobby">
            <div id='lobby-title'>
                <img src={TITLE_IMG} />
            </div>
            <div id='lobby-avatars-container'>
                {
                    avatars.map((avatar, avatarIndex) =>
                        <div className={'lobby-avatar' + (avatar === selectedAvatar ? ' selected-avatar' : '')}
                            onClick={() => { selectAvatar(avatarIndex) }}>
                            <img src={avatar.img} />
                            {avatar === selectedAvatar && loadingAvatar ? <Loader absolute={true} /> : null}
                        </div>
                    )
                }
            </div>
            <div id='lobby-input-container'>
                <label>NADIMAK</label>
                <input type='text' placeholder='Unesite korisničko ime' value={username} onChange={updateUsername} />
                {loadingUsername ? <Loader absolute={true} style={{ borderColor: "black", right: "0" }} /> : null}
            </div>
            <button id='btn-play' className={'btn btn-primary btn-large' + (btnEnabled ? '' : ' btn-disabled')} onClick={joinPublicRoom}>Igraj</button>
            <button id='btn-private-room' className={'btn btn-secondary btn-large' + (btnEnabled ? '' : ' btn-disabled')} onClick={createPrivateRoom}>Kreiraj privatnu sobu</button>
            <button id='btn-logout' className={'btn btn-tertiary btn-large' + (btnEnabled ? '' : ' btn-disabled')} onClick={logout}>Odjavi se</button>
        </div>
    )
}

export default Lobby;