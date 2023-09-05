import React, { useContext, useEffect, useState } from 'react';

import './style.css';
import { DataContext } from '../../../Context';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';
import CLOCK_IMG from '../../../img/clock.svg';
import EXIT_BUTTON_IMG from '../../../img/exit_button.svg';

const GameHeader = () => {
    const context = useContext(DataContext)

    const progressBarLength = () => {
        return 100 * (context?.gameState?.started === true
            ? (context?.gameState?.current_time / context?.gameSettings?.round_time)
            : 1);
    }

    return (
        <div id='game-header'>
            <div id="game-round-time">
                <div className='flex-wrapper center'>
                    <div id='game-time'>
                        <img src={CLOCK_IMG}></img>
                        <p>{context?.gameState?.started === true ? context?.gameState?.current_time : context?.gameSettings?.round_time}</p>
                    </div>
                    <p id='game-round'>Runda {context?.gameState?.current_round} / {context?.gameSettings?.round_count}</p>
                </div>
                <div id='exit-button' onClick={context?.openExitModal}>
                    <img src={EXIT_BUTTON_IMG}></img>
                </div>
            </div>
            <div id='game-time-progress-bar-background'></div>
            <div id='game-time-progress-bar' style={{ width: `${progressBarLength()}%` }}></div>
        </div>
    )
}

export default GameHeader;