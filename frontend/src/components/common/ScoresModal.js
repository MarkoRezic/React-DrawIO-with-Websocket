import React, { useContext, useEffect, useState } from 'react';

import './style.css';
import { DataContext } from '../../Context';
import EXIT_BUTTON_IMG from '../../img/exit_button.svg';
import { AudioManager, SoundType } from '../../AudioManager';
import axios from '../../axios'
import useDebounce from '../../utils/use_debounce';
import Loader from './Loader';

const ScoresModal = () => {
    const context = useContext(DataContext)
    const [userCount, setUserCount] = useState(2)
    const [roundCount, setRoundCount] = useState(5)
    const [scores, setScores] = useState([])
    const [loadingScores, setLoadingScores] = useState(true)

    const getScores = () => {
        setLoadingScores(true);
        axios.get(`scores?user_count=${userCount}&round_count=${roundCount}`).then((response) => {
            console.log(response)
            setScores(response.data?.scores ?? [])
            setLoadingScores(false);
        })
    }

    useEffect(() => {
        getScores()
    }, [])

    const decrementUserCount = () => {
        if (userCount > 2) {
            setLoadingScores(true);
            AudioManager.playSound(SoundType.button)
            setUserCount(userCount - 1)
            debouncedGetScores()
        }
    }

    const incrementUserCount = () => {
        if (userCount < 8) {
            setLoadingScores(true);
            AudioManager.playSound(SoundType.button)
            setUserCount(userCount + 1)
            debouncedGetScores()
        }
    }

    const decrementRoundCount = () => {
        if (roundCount > 2) {
            setLoadingScores(true);
            AudioManager.playSound(SoundType.button)
            setRoundCount(roundCount - 1)
            debouncedGetScores()
        }
    }

    const incrementRoundCount = () => {
        if (roundCount < 10) {
            setLoadingScores(true);
            AudioManager.playSound(SoundType.button)
            setRoundCount(roundCount + 1)
            debouncedGetScores()
        }
    }


    const debouncedGetScores = useDebounce(getScores, 700)


    return (
        <div id='scores-modal-container'>
            <div id='scores-modal-background' onClick={context?.closeScores}></div>
            <div id='scores-modal'>
                <div id='scores-modal-close' onClick={context?.closeScores}>
                    <img src={EXIT_BUTTON_IMG}></img>
                </div>
                <div className='scores-modal-title'>
                    <p>Rezultati</p>
                </div>
                <div className='scores-modal-row'>
                    <p className='scores-modal-setting-name'>Broj igrača:</p>
                    <div className='flex-wrapper center'>
                        <div className='arrow-button' onClick={decrementUserCount}>{'<'}</div>
                        <p className='scores-modal-setting-value'>{userCount}</p>
                        <div className='arrow-button' onClick={incrementUserCount}>{'>'}</div>
                    </div>
                </div>
                <div className='scores-modal-row'>
                    <p className='scores-modal-setting-name'>Broj rundi:</p>
                    <div className='flex-wrapper center'>
                        <div className='arrow-button' onClick={decrementRoundCount}>{'<'}</div>
                        <p className='scores-modal-setting-value'>{roundCount}</p>
                        <div className='arrow-button' onClick={incrementRoundCount}>{'>'}</div>
                    </div>
                </div>
                {
                    loadingScores ? <Loader style={{
                        "borderColor": "var(--main-color)",
                        "borderWidth": '10px',
                        'width': '50px',
                        'height': '50px'
                    }} />
                        : scores?.length === 0 ? <div id='empty-scores'>Nema rezultata</div>
                            : scores.map((score, score_index) =>
                                <div className='score-row'>
                                    <span className='score-position'>#{score_index + 1}</span>
                                    <span className='score-username'>{score?.username}</span>
                                    <span className='score-points'>{score?.points}</span>
                                </div>
                            )
                }
            </div>
        </div>
    )
}

export default ScoresModal;