import React, { useContext, useEffect, useRef, useState } from 'react';

import './style.css';
import { DataContext } from '../../../Context';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';
import { useParams } from 'react-router-dom';
import { AudioManager, SoundType } from '../../../AudioManager';

const Chat = () => {
    const context = useContext(DataContext);
    const { room_id } = useParams();
    const messsagesRef = useRef([])

    const [message, setMessage] = useState('');
    const [messagesList, setMessagesList] = useState(messsagesRef.current);
    const [socketInit, setSocketInit] = useState(false)


    const MessageAccess = {
        public: "public",
        private: "private",
    }

    const MessageType = {
        info: "info",
        success: "success",
        winner: "winner",
        generic: "generic",
    }

    useEffect(() => {
        if (context?.socketRef?.current == null || socketInit) {
            return;
        }
        console.log("TEST")

        setSocketInit(true)

        context.socketRef.current.on("game-chat-message", ({ messages }) => {
            AudioManager.playSound(SoundType.chat)
            messsagesRef.current = [...messsagesRef.current, ...messages.filter(chatMessage => chatMessage.message_access === MessageAccess.public
                || context?.user?.user_id === message?.user?.user_id)]
            setMessagesList(messsagesRef.current);
        });

    }, [context?.socketRef?.current])

    useEffect(() => {
        let chatList = document.getElementById('chat-messages-list')
        chatList.scrollTop = chatList.scrollHeight;
    }, [messagesList, setMessagesList])

    const updateMessage = (e) => {
        setMessage(e?.target?.value)
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.length === 0) {
            return;
        }

        context.socketRef.current.emit('send-message', {
            user: context?.user,
            room_id,
            message,
        });
        setMessage('');
    }

    return (
        <div id='chat'>
            <div id='chat-messages-list'>
                {
                    messagesList.map((message, messageIndex) =>
                        <div className={`message ${message?.message_type} ${message?.user == null ? 'no-user' : ''}`} key={messageIndex}>
                            <span className='message-user'>{message?.user?.username}</span>
                            <span className='message-text'>{message.text}</span>
                        </div>
                    )
                }
            </div>
            <form id='chat-input-form' onSubmit={sendMessage}>
                <input type='text'
                    id='chat-input'
                    placeholder='Pogodi...'
                    value={message}
                    onChange={updateMessage}
                    disabled={
                        context?.gameState?.correct_guess_user_id_list?.includes(context?.user?.user_id)
                        || context?.gameState?.drawing_user_id === context?.user?.user_id
                    }
                ></input>
            </form>
        </div>
    )
}

export default Chat;