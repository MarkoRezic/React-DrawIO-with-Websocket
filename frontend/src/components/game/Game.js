import React, { useContext, useEffect, useRef, useState } from 'react';
import avatars from '../common/avatars';
import socketio from 'socket.io-client';

import './style.css';
import { DataContext } from '../../Context';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';
import UserList from './user_list/UserList';
import { Board } from './board/Board';
import GameSetup from './setup/GameSetup';
import Chat from './chat/Chat';
import { webSocketBaseUrl } from '../../axios';
import { useParams } from 'react-router-dom';
import tryNTimes from '../../utils/try_n_times';

const Game = () => {
    const context = useContext(DataContext);
    const { room_id } = useParams();

    const hasSocketId = () => {
        return context?.socketRef?.current?.id != null
    }

    useEffect(() => {
        if (context?.user == null) {
            return;
        }
        context.socketRef.current = socketio.connect(webSocketBaseUrl, {
            withCredentials: true
        })

        context.socketRef.current.on("user-joined", ({ user, gameState }) => {
            toast(user?.user_id === context?.user?.user_id ? 'You joined' : `User joined: ${user?.username}`);
            context.setGameState(gameState)
        })

        context.socketRef.current.on("user-leave", ({ user, gameSettings, gameState }) => {
            toast(user?.user_id === context?.user?.user_id ? 'You left' : `User left: ${user?.username}`);
            context.setGameState(gameState)
        })

        context.socketRef.current.on("update-game-state", ({ gameState, event_name }) => {
            context.setGameState(gameState)
            switch (event_name) {
                case 'next-tick':
                    break;
                case 'next-user-turn':
                    break;
                case 'next-round':
                    break;
                case 'game-over':
                    break;
                default:
                    break;
            }
        })

        tryNTimes(() => {
            context.socketRef.current.emit('join-room', {
                user: context?.user,
                room_id,
                gameSettings: context?.gameSettings,
            });

        }, 500, hasSocketId, 10)
        return () => {

        }
    }, [context?.user])

    return (
        <div id="game">
            <UserList />
            {context?.gameState?.started === true ? <Board /> : <GameSetup />}
            <Chat />
        </div>
    )
}

export default Game;