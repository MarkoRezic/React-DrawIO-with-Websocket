import React, { useContext, useState } from "react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { AudioManager, MusicType } from "../../AudioManager"
import { DataContext } from "../../Context"


const MusicPlayer = (params) => {
    const context = useContext(DataContext)
    const [canPlay, setCanPlay] = useState(false)

    useEffect(() => {
        window.addEventListener('click', () => {
            setCanPlay(true)
        }, { once: true })
    }, [])

    // detect route change for music playing
    const location = useLocation()
    useEffect(() => {
        if (!canPlay) {
            return
        }
        if (location.pathname === '/' || location.pathname === '/login') {
            AudioManager.playMusic(MusicType.menu);
        }
        else if (location.pathname.startsWith('/room/')) {
            if (context?.gameState?.started === true) {
                AudioManager.playMusic(MusicType.game);
            }
            else {
                AudioManager.playMusic(MusicType.lobby);
            }
        }
    }, [location, canPlay, context?.gameState])

    return (
        <></>
    )
}

export default MusicPlayer;