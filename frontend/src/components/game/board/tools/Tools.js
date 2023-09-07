import React, { useContext, useEffect, useRef, useState } from 'react';

import './style.css';
import { DataContext } from '../../../../Context';
import lightOrDark from '../../../../utils/light_or_dark';

const Tools = () => {
    const context = useContext(DataContext);

    return (
        <div id="tools-section">
            {context?.gameState?.drawing_user_id === context?.user?.user_id
                ? <>
                    <div id="color-picker-container">
                        BOJA: &nbsp;
                        <input className={`${lightOrDark(context?.color)} `} type="color" value={context.color} onChange={(e) => { context.setColor(e.target.value); document.querySelector(':root').style.setProperty('--drawing-color', context?.color); }} />
                    </div>
                    <div id="brushsize-container">
                        VELIČINA: &nbsp;
                        <input className={`${lightOrDark(context?.color)} `} type='range' value={context.size} onChange={(e) => { context.setSize(e.target.value) }} min={1} max={100} />
                    </div>
                </>
                : null
            }
            <div id={`${context?.gameState?.drawing_user_id !== context?.user?.user_id ? 'guess' : 'draw'}-word-container`}>
                <span>{context?.gameState?.drawing_user_id === context?.user?.user_id ? 'NACRTAJ' : 'POGODI'}: &nbsp;</span>
                {
                    context?.gameState?.current_word?.split("")?.map?.((wordLetter, wordLetterIndex) =>
                        <span className={`${context?.gameState?.drawing_user_id !== context?.user?.user_id ? 'guess' : 'draw'}-word-letter`} key={wordLetterIndex}>
                            {
                                wordLetter !== ' '
                                    && (context?.gameState?.drawing_user_id !== context?.user?.user_id
                                        && (wordLetterIndex >= context?.gameState?.current_word?.length - 2
                                            || wordLetterIndex >= context?.gameState?.current_hints))
                                    ? '_' : wordLetter
                            }
                        </span>
                    )
                }
            </div>
        </div>
    )
}

export default Tools;