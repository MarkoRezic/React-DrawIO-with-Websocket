import React, { useState, useContext } from 'react';
import TITLE_IMG from '../../img/title.svg'

import './style.css';
import { DataContext } from '../../Context'
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import { AudioManager, SoundType } from '../../AudioManager';

const Login = () => {
    const context = useContext(DataContext);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const updateUsername = (e) => {
        setUsername(e.target.value)
    }

    const updatePassword = (e) => {
        setPassword(e.target.value)
    }

    const login = () => {
        if (btnEnabled) {
            AudioManager.playSound(SoundType.button)
            setLoading(true);
            context.login(username, password, (errorCode) => {
                setLoading(false);
                toast('Pogrešni podaci', { type: 'error' })
            });
        }
    }

    const register = () => {
        if (btnEnabled) {
            AudioManager.playSound(SoundType.button)
            setLoading(true);
            context.register(username, password, (errorCode) => {
                setLoading(false);
                if (errorCode === 400) {
                    toast('Korisničko ime je već zauzeto', { type: 'error' })
                }
                else {
                    toast('Pogreška na serveru', { type: 'error' })
                }
            });
        }
    }

    const toggleShowPassword = () => {
        AudioManager.playSound(SoundType.button)
        setShowPassword(!showPassword)
    }

    const btnEnabled = username.trim() !== '' && password.trim() !== '';


    return (
        <div id="login">
            <div className='login-title-img'>
                <img src={TITLE_IMG} />
            </div>
            <div className='login-title'>
                <p>Prijava</p>
            </div>
            <div id='login-input-container'>
                <label>NADIMAK</label>
                <input type='text' placeholder='Unesite korisničko ime' value={username} onChange={updateUsername} />
            </div>
            <div id='login-input-container'>
                <label>LOZINKA</label>
                <div className='flex-wrapper full-width'>
                    <input type={showPassword ? 'text' : 'password'} placeholder='Unesite lozinku' value={password} onChange={updatePassword} />
                    <div className='show-password selectable' onClick={toggleShowPassword}><p>{showPassword ? 'Sakrij' : 'Prikaži'}</p></div>
                </div>
            </div>
            <button id='btn-login' className={'btn btn-primary btn-large' + (btnEnabled ? '' : ' btn-disabled')} onClick={login}>Prijavi se {loading ? <Loader /> : null}</button>
            <button id='btn-register' className={'btn btn-secondary btn-large' + (btnEnabled ? '' : ' btn-disabled')} onClick={register}>Registriraj se {loading ? <Loader /> : null}</button>
        </div>
    )
}

export default Login;