import React, { useRef } from 'react';
import { useState, createContext, useEffect } from 'react';
import axios from './axios';
import { AudioManager, SoundType } from './AudioManager';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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
        musicVolume,
        setMusicVolume,
        soundVolume,
        setSoundVolume,
        showSettings,
        setShowSettings,
        openSettings,
        closeSettings,
        showPlayerOverlay,
        setShowPlayerOverlay,
        showGameOverlay,
        setShowGameOverlay,
        showScores,
        setShowScores,
        openScores,
        closeScores,
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
                musicVolume,
                setMusicVolume,
                soundVolume,
                setSoundVolume,
                showSettings,
                setShowSettings,
                openSettings,
                closeSettings,
                showPlayerOverlay,
                setShowPlayerOverlay,
                showGameOverlay,
                setShowGameOverlay,
                showScores,
                setShowScores,
                openScores,
                closeScores,
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
    const [musicVolume, setMusicVolume] = useState(0.2);
    const [soundVolume, setSoundVolume] = useState(1)
    const [showSettings, setShowSettings] = useState(false);
    const [showScores, setShowScores] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Canvas tools
    const [color, setColor] = useState("#000000")
    const [size, setSize] = useState(5)

    // Event Overlays
    const [showPlayerOverlay, setShowPlayerOverlay] = useState(false);
    const [showGameOverlay, setShowGameOverlay] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowPlayerOverlay(false)
        }, 2500)
    }, [showPlayerOverlay, setShowPlayerOverlay])

    useEffect(() => {
        if (showGameOverlay === true) {
            setTimeout(() => {
                setShowGameOverlay(false)
            }, 5000)
        }
    }, [showGameOverlay, setShowGameOverlay])

    // initialize sounds
    useEffect(() => {
        AudioManager.init(musicVolume, soundVolume);
    }, [])

    // update sounds
    useEffect(() => {
        AudioManager.updateVolume(musicVolume, soundVolume)
    }, [musicVolume, setMusicVolume, soundVolume, setSoundVolume])

    // leave-room if room_id changes
    useEffect(() => {
        const room_id = sessionStorage.getItem('last-room-id')
        console.log(room_id, location.pathname, location.pathname.endsWith(room_id), !location.pathname.endsWith(room_id))
        if (!(location.pathname.startsWith('/room')) && !(location.pathname.endsWith(room_id)) && room_id != null && room_id.length !== '' && socketRef.current != null) {
            console.log("LEAVING", room_id, location.pathname, location.pathname.endsWith(room_id), !location.pathname.endsWith(room_id))
            socketRef.current.emit('leave-room', {
                user: user,
                room_id,
            });
            setGameSettings(defaultGameSettings)
            setGameState(defaultGameState)
            sessionStorage.removeItem('last-room-id')
            socketRef.current = null;
        }
    }, [location])

    useEffect(() => {
        const localUser = sessionStorage.getItem("user");
        if (localUser == null && window.location.pathname !== '/login') {
            navigate('/login', { replace: true })
        }
        else if (user == null && localUser != null) {
            setUser(JSON.parse(localUser))
        }
        else if (user != null && localUser != null && window.location.pathname === '/login') {
            navigate('/', { replace: true })
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
        AudioManager.playSound(SoundType.button)
        document.body.style.overflow = "hidden";
        setConfirmExit(true)
    }

    const exitGame = () => {
        AudioManager.playSound(SoundType.button)
        AudioManager.playSound(SoundType.player_leave)
        document.body.style.overflow = "auto";
        navigate('/', { replace: true })
        setConfirmExit(false)
    }

    const cancelExit = () => {
        AudioManager.playSound(SoundType.button)
        document.body.style.overflow = "auto";
        setConfirmExit(false)
    }

    const openSettings = () => {
        AudioManager.playSound(SoundType.button)
        document.body.style.overflow = "hidden";
        setShowSettings(true)
    }

    const closeSettings = () => {
        AudioManager.playSound(SoundType.button)
        document.body.style.overflow = "auto";
        setShowSettings(false)
    }

    const openScores = () => {
        AudioManager.playSound(SoundType.button)
        document.body.style.overflow = "hidden";
        setShowScores(true)
    }

    const closeScores = () => {
        AudioManager.playSound(SoundType.button)
        document.body.style.overflow = "auto";
        setShowScores(false)
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
        musicVolume,
        setMusicVolume,
        soundVolume,
        setSoundVolume,
        showSettings,
        setShowSettings,
        openSettings,
        closeSettings,
        showPlayerOverlay,
        setShowPlayerOverlay,
        showGameOverlay,
        setShowGameOverlay,
        showScores,
        setShowScores,
        openScores,
        closeScores,
    }

}