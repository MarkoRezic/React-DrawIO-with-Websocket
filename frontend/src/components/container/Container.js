import React, { useState } from 'react';
import { Board } from '../board/Board';

import './style.css';

export const Container = () => {
    const [color, setColor] = useState("#000000")
    const [size, setSize] = useState(5)

    return (
        <div className="container">
            <div class="tools-section">
                <div className="color-picker-container">
                    Select Brush Color : &nbsp;
                    <input type="color" value={color} onChange={(e) => { setColor(e.target.value) }} />
                </div>

                <div className="brushsize-container">
                    Select Brush Size : &nbsp;
                    <input type='range' value={size} onChange={(e) => { setSize(e.target.value) }} min={1} max={100} />
                </div>

            </div>

            <div class="board-container">
                <Board color={color} size={size} />
            </div>
        </div>
    )
}