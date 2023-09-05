import React, { useRef } from 'react';
import { useState, createContext, useEffect } from 'react';
import axios from './axios';

export const DataContext = createContext();

export const DataProvider = (props) => {

    const {
        user,
        setUser,
        socketRef,
        gameSettings,
        setGameSettings,
        gameState,
        setGameState,
        gameChatMessages,
        setGameChatMessages,
        confirmExit,
        setConfirmExit,
        register,
        login,
        logout,
        updateUsername,
        updateAvatar,
        openExitModal,
        exitGame,
        cancelExit,
        color,
        setColor,
        size,
        setSize,
    } = useProviderFunctions()

    return (
        <DataContext.Provider value={
            {
                user,
                setUser,
                socketRef,
                gameSettings,
                setGameSettings,
                gameState,
                setGameState,
                gameChatMessages,
                setGameChatMessages,
                confirmExit,
                setConfirmExit,
                register,
                login,
                logout,
                updateUsername,
                updateAvatar,
                openExitModal,
                exitGame,
                cancelExit,
                color,
                setColor,
                size,
                setSize,
            }
        }>
            {props.children}
        </DataContext.Provider>
    );
}

export const defaultGameSettings = {
    max_users: 5,
    round_time: 60,
    round_count: 5,
    hint_count: 2,
    custom_words: []
}

export const defaultGameState = {
    admin_user_id: null,
    started: false,
    user_list: [],
    drawing_user_id: null,
    correct_guess_user_id_list: [],
    total_points_user_id_map: {},
    current_time: defaultGameSettings.round_time,
    current_round: 1,
    current_round_played_user_id_list: [],
    current_word: null,
    used_custom_words: [],
    current_hints: 0,
}

const useProviderFunctions = () => {
    const [user, setUser] = useState(null);
    const socketRef = useRef(null)
    const [gameSettings, setGameSettings] = useState(defaultGameSettings);
    const [gameState, setGameState] = useState(defaultGameState);
    const [gameChatMessages, setGameChatMessages] = useState([]);
    const [confirmExit, setConfirmExit] = useState(false);

    // Canvas tools
    const [color, setColor] = useState("#000000")
    const [size, setSize] = useState(5)

    useEffect(() => {
        const localUser = sessionStorage.getItem("user");
        if (localUser == null && window.location.pathname !== '/login') {
            window.location.replace('/login')
        }
        else if (user == null && localUser != null) {
            setUser(JSON.parse(localUser))
        }
        else if (user != null && localUser != null && window.location.pathname === '/login') {
            window.location.replace('/')
        }
    }, [user, setUser])

    const login = (username, password, errorCallback) => {
        axios.post('users/login', {
            username,
            password,
        }).then((response) => {
            console.log(response);
            sessionStorage.setItem("user", JSON.stringify(response?.data?.user));
            setUser(response?.data?.user);
        }).catch((error) => {
            console.log(error);
            errorCallback(error?.response?.status);
        })
    }

    const register = (username, password, errorCallback) => {
        axios.post('users/register', {
            username,
            password
        }).then((response) => {
            console.log(response);
            login(username, password);
        }).catch((error) => {
            console.log(error);
            errorCallback(error?.response?.status);
        })
    }

    const updateUsername = (username, callback, errorCallback) => {
        axios.put(`users/username/${user.user_id}`, {
            username
        }).then((response) => {
            console.log(response);
            console.log(username);
            console.log({ ...user, username: username });
            sessionStorage.setItem("user", JSON.stringify({ ...user, username }));
            setUser({ ...user, username });
            callback(response);
        }).catch((error) => {
            console.log(error);
            errorCallback(error?.response?.status);
        })
    }

    const updateAvatar = (avatar, callback, errorCallback) => {
        axios.put(`users/avatar/${user.user_id}`, {
            avatar
        }).then((response) => {
            console.log(response);
            sessionStorage.setItem("user", JSON.stringify({ ...user, avatar }));
            setUser({ ...user, avatar });
            callback(response);
        }).catch((error) => {
            console.log(error);
            errorCallback(error?.response?.status);
        })
    }

    const logout = () => {
        sessionStorage.removeItem("user")
        setUser(null);
    }

    const openExitModal = () => {
        document.body.style.overflow = "hidden";
        setConfirmExit(true)
    }

    const exitGame = () => {
        document.body.style.overflow = "auto";
        window.location.replace('/');
    }

    const cancelExit = () => {
        document.body.style.overflow = "auto";
        setConfirmExit(false)
    }

    return {
        user,
        setUser,
        socketRef,
        gameSettings,
        setGameSettings,
        gameState,
        setGameState,
        gameChatMessages,
        setGameChatMessages,
        confirmExit,
        setConfirmExit,
        register,
        login,
        logout,
        updateUsername,
        updateAvatar,
        openExitModal,
        exitGame,
        cancelExit,
        color,
        setColor,
        size,
        setSize,
    }

}