import React, { useContext, useEffect, useState } from 'react';

import './style.css';
import { DataContext } from '../../../Context';

const ExitModal = () => {
    const context = useContext(DataContext)


    return (
        <div id='game-confirm-exit'>
            <div id='game-confirm-exit-background' onClick={context?.cancelExit}></div>
            <div id='game-confirm-exit-modal'>
                <div className='confirm-exit-title'>
                    <p>Jeste li sigurni da želite napustiti?</p>
                </div>
                <div className='button-row'>
                    <div className='confirm-exit-button exit' onClick={context?.exitGame}>Da</div>
                    <div className='confirm-exit-button cancel' onClick={context?.cancelExit}>Ne</div>
                </div>
            </div>
        </div>
    )
}

export default ExitModal;