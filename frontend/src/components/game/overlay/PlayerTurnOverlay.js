import React, { useContext, useEffect, useRef, useState } from 'react';
import avatars from '../../common/avatars';

import './style.css';
import { DataContext } from '../../../Context';

const PlayerTurnOverlay = () => {
    const context = useContext(DataContext);


    useEffect(() => {
        setTimeout(() => {
            context.setShowPlayerOverlay(false)
        }, 2500)
    }, [])


    const drawingUser = () => context?.gameState?.user_list?.find?.(user => user?.user_id === context?.gameState?.drawing_user_id)

    return (
        <div id='player-turn-overlay' className='overlay'>
            <div className='overlay-background'></div>
            <div className='player-overlay-content'>
                <img className='player-overlay-avatar' src={avatars?.[drawingUser()?.avatar]?.img} />
                <p>
                    <span className='player-overlay-username'>{drawingUser()?.username}</span>
                    <span className='player-overlay-text'> crta sljedeću riječ!</span>
                </p>
            </div>
        </div>
    )
}

export default PlayerTurnOverlay;