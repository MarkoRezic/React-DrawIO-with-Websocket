import React, { useContext, useEffect, useState } from 'react';

import './style.css';
import { DataContext } from '../../../Context';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';

const Chat = () => {
    const context = useContext(DataContext)


    return (
        <div id='chat'>
            <p id='chat-header'>Chat</p>
        </div>
    )
}

export default Chat;