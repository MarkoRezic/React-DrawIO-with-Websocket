import menuMusic from './music/menu_music.mp3'
import lobbyMusic from './music/lobby_music.mp3'
import gameMusic from './music/game_music.mp3'
import buttonSound from './sounds/button_sound.mp3'
import chatSound from './sounds/chat_sound.mp3'
import correctGuessSound from './sounds/correct_guess.mp3'
import gameOverSound from './sounds/game_over.mp3'
import gameStartSound from './sounds/game_start.mp3'
import gameTickSound from './sounds/game_tick.mp3'
import playerJoinSound from './sounds/player_join_sound.mp3'
import playerLeaveSound from './sounds/player_leave_sound.mp3'
import roundStartSound from './sounds/round_start.mp3'

const MusicType = {
    menu: "menu",
    lobby: "lobby",
    game: "game",
}

const SoundType = {
    button: "button",
    chat: "chat",
    correct_guess: "correct_guess",
    game_over: "game_over",
    game_start: "game_start",
    game_tick: "game_tick",
    player_join: "player_join",
    player_leave: "player_leave",
    round_start: "round_start",
}

class AudioManager {
    static currentMusic = null;
    static music = {
        menu: new Audio(menuMusic),
        lobby: new Audio(lobbyMusic),
        game: new Audio(gameMusic),
    };

    static sounds = {
        button: new Audio(buttonSound),
        chat: new Audio(chatSound),
        correct_guess: new Audio(correctGuessSound),
        game_over: new Audio(gameOverSound),
        game_start: new Audio(gameStartSound),
        game_tick: new Audio(gameTickSound),
        player_join: new Audio(playerJoinSound),
        player_leave: new Audio(playerLeaveSound),
        round_start: new Audio(roundStartSound),
    }

    static init(musicVolume, soundVolume) {
        for (let [key, audio] of Object.entries(this.music)) {
            audio.volume = musicVolume
            audio.pause();
            audio.loop = true;
            audio.currentTime = 0;
        }
        for (let [key, audio] of Object.entries(this.sounds)) {
            audio.volume = soundVolume
        }
    }

    static updateVolume(musicVolume, soundVolume) {
        for (let [key, audio] of Object.entries(this.music)) {
            audio.volume = musicVolume
        }
        for (let [key, audio] of Object.entries(this.sounds)) {
            audio.volume = soundVolume
        }
    }

    static playMusic(musicKey) {
        if (this.currentMusic === musicKey) {
            return;
        }
        if (this.currentMusic != null) {
            this.music[this.currentMusic].pause();
            this.music[this.currentMusic].currentTime = 0;
        }
        this.currentMusic = musicKey
        this.music[this.currentMusic].play();
    }

    static playSound(soundKey) {
        let sound = this.sounds[soundKey].cloneNode()
        sound.volume = this.sounds[soundKey].volume
        sound.play();
    }
}

export {
    AudioManager,
    MusicType,
    SoundType,
}