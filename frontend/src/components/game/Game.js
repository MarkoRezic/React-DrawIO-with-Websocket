import React, { useContext, useEffect, useRef, useState } from 'react';
import avatars from '../common/avatars';
import socketio from 'socket.io-client';
import TITLE_IMG from '../../img/title.svg'

import './style.css';
import { DataContext } from '../../Context';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';
import UserList from './user_list/UserList';
import { Board } from './board/Board';
import GameSetup from './setup/GameSetup';
import Chat from './chat/Chat';
import { webSocketBaseUrl } from '../../axios';
import { useNavigate, useParams } from 'react-router-dom';
import tryNTimes from '../../utils/try_n_times';
import GameHeader from './header/GameHeader';
import ExitModal from './modal/ExitModal';
import Tools from './board/tools/Tools';

const Game = () => {
    const context = useContext(DataContext);
    const { room_id } = useParams();

    const navigate = useNavigate()

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

        context.socketRef.current.on("join-failed", ({ reason }) => {
            toast(`Pridruživanje nije uspjelo, ${reason === "ROOM_FULL" ? 'igra je puna' : 'već ste u igri'}`)
            navigate('/')
        })

        context.socketRef.current.on("user-joined", ({ user, gameState }) => {
            toast(user?.user_id === context?.user?.user_id ? 'Dobrodošli u sobu!' : `${user?.username} se pridružio u sobu!`, { type: "info" });
            context.setGameState(gameState)
        })

        context.socketRef.current.on("user-leave", ({ user, gameSettings, gameState }) => {
            toast(user?.user_id === context?.user?.user_id ? 'Napustili ste sobu' : `${user?.username} je napustio sobu`, { type: "info" });
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
                case 'admin-change':
                    toast('Ti si sada admin sobe!', { type: "info" })
                    break;
                default:
                    break;
            }
        })

        context.socketRef.current.on("update-game-settings", ({ gameSettings }) => {
            context.setGameSettings(gameSettings)
        })

        tryNTimes(() => {
            context.socketRef.current.emit('join-room', {
                user: context?.user,
                room_id,
                gameSettings: context?.gameSettings,
            });

        }, 500, hasSocketId, 10)
        return () => {
            context.socketRef.current.emit('leave-room', {
                user: context?.user,
                room_id,
            });
        }
    }, [context?.user])

    return (
        <div id='game-container'>
            <div id='game-title'>
                <img src={TITLE_IMG} />
            </div>
            <GameHeader />
            <div id="game">
                <UserList />
                {context?.gameState?.started === true ? <Board /> : <GameSetup />}
                <Chat />
            </div>
            <Tools />

            {context?.confirmExit ?
                <ExitModal />
                : null
            }
        </div>
    )
}

export default Game;