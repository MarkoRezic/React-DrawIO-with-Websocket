import React, { useContext, useEffect, useState } from 'react';

import './style.css';
import { DataContext } from '../../../Context';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';
import settings from '../../common/settings';
import { useParams } from 'react-router-dom';
import useDebounce from '../../../utils/use_debounce';

const GameSetup = () => {
    const context = useContext(DataContext);
    const { room_id } = useParams();
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
        window.navigator.clipboard.writeText(window.location.href);
        setCopied(true)
    }

    const emitSettings = () => {
        context.socketRef.current.emit('change-settings', {
            room_id,
            gameSettings: context?.gameSettings,
        });
    }

    const decrementSetting = (settingIndex) => {
        if (context?.gameSettings?.[settings[settingIndex].key] > settings[settingIndex].min) {
            const gameSettings = {
                ...context?.gameSettings,
            }
            gameSettings[`${settings[settingIndex].key}`] = gameSettings[`${settings[settingIndex].key}`] - 1;
            context.setGameSettings({
                ...gameSettings
            });
            emitSettings();
        }
    }

    const incrementSetting = (settingIndex) => {
        if (context?.gameSettings?.[settings[settingIndex].key] < settings[settingIndex].max) {
            const gameSettings = {
                ...context?.gameSettings,
            }
            gameSettings[`${settings[settingIndex].key}`] = gameSettings[`${settings[settingIndex].key}`] + 1;
            context.setGameSettings({
                ...gameSettings
            });
            emitSettings();
        }
    }

    const gameSettingValue = (settingIndex) => {
        return context?.gameSettings?.[`${settings[settingIndex].key}`]
    }

    const updateCustomWords = (e) => {
        const gameSettings = {
            ...context?.gameSettings,
        }
        gameSettings['custom_words'] = e?.target?.value?.split(",")?.map(value => value.trim()) ?? [];
        context.setGameSettings({
            ...gameSettings
        });
        debouncedEmitSettings();
    }

    const startGame = () => {
        context.socketRef.current.emit('start-game', {
            user: context?.user,
            room_id,
        });
    }

    const debouncedEmitSettings = useDebounce(emitSettings, 700)

    const btnEnabled = context?.gameState?.user_list?.length > 1

    return (
        <div id="game-setup">
            {context?.gameState?.admin_user_id === context?.user?.user_id ?
                <div id="game-settings">
                    <div id="game-settings-link">
                        <p>{`${window.location.href}`}</p>
                        <div className='copy-link' onClick={copyLink}>{copied ? 'Kopirano!' : 'Kopiraj'}</div>
                    </div>
                    {
                        settings.map((setting, settingIndex) =>
                            <div className='game-settings-input'>
                                <img src={setting.img} />
                                <p>{setting.title}</p>
                                <div className='integer-input'>
                                    <div className='integer-input-button decrement-button' onClick={() => { decrementSetting(settingIndex) }}>-</div>
                                    <div className='integer-input-value'>{gameSettingValue(settingIndex)}</div>
                                    <div className='integer-input-button decrement-button' onClick={() => { incrementSetting(settingIndex) }}>+</div>
                                </div>
                            </div>
                        )
                    }
                    <div className='game-settings-custom-words'>
                        <p>Nasumične Riječi</p>
                        <textarea placeholder='Riječi razdvojite zarezom' value={context?.gameSettings?.custom_words?.join(",") ?? ''} onChange={updateCustomWords}></textarea>
                    </div>
                    <button id='btn-play' className={'btn btn-primary btn-large' + (btnEnabled ? '' : ' btn-disabled')} onClick={startGame}>Igraj</button>
                </div>
                : <div id="waiting-for-players">
                    <Loader style={{ width: '80px', height: '80px' }} />
                    <p>Čekanje ostalih igrača...</p>
                </div>

            }
        </div>
    )
}

export default GameSetup;