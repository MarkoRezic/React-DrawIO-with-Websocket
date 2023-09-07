import React, { useContext, useEffect, useState } from 'react';

import './style.css';
import { DataContext } from '../../Context';
import EXIT_BUTTON_IMG from '../../img/exit_button.svg';

const SettingsModal = () => {
    const context = useContext(DataContext)

    const updateMusicVolume = (e) => {
        context.setMusicVolume(e?.target?.value / 100)
    }

    const updateSoundVolume = (e) => {
        context.setSoundVolume(e?.target?.value / 100)
    }


    return (
        <div id='settings-modal-container'>
            <div id='settings-modal-background' onClick={context?.closeSettings}></div>
            <div id='settings-modal'>
                <div id='settings-modal-close' onClick={context?.closeSettings}>
                    <img src={EXIT_BUTTON_IMG}></img>
                </div>
                <div className='settings-modal-title'>
                    <p>Postavke</p>
                </div>
                <div className='settings-modal-row'>
                    <p className='settings-modal-setting-name'>Glasnoća Glazbe: {Math.round(context?.musicVolume * 100)}%</p>
                    <input type='range' value={context?.musicVolume * 100} onChange={updateMusicVolume} min={0} max={100}></input>
                </div>
                <div className='settings-modal-row'>
                    <p className='settings-modal-setting-name'>Glasnoća Zvukova: {Math.round(context?.soundVolume * 100)}%</p>
                    <input type='range' value={context?.soundVolume * 100} onChange={updateSoundVolume} min={0} max={100}></input>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal;