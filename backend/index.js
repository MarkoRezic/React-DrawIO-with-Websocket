const frontend_origin = 'http://localhost:3000';

// Express
import express from 'express'
import cors from 'cors'
import { db } from './database.js';
const app = express();
app.use(cors({ origin: frontend_origin, credentials: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
      res.json({ message: "success" })
})

app.post("/users/login", async (req, res) => {
      console.log(req.body)
      const { username, password } = req.body
      try {
            const [result] = await db.query(`
            SELECT user_id, username, password, avatar
            FROM users
            WHERE username = ?
            AND password = ?
            LIMIT 1;
            `, [username, password]);

            console.log(result)
            if (result.length === 0) {
                  res.status(401).json({ message: "Pogrešni podaci" });
            }
            else {
                  res.status(200).json({ message: "success", user: result[0] });
            }
      } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error" })
      }
})

app.post("/users/register", async (req, res) => {
      console.log(req.body)
      const { username, password } = req.body
      try {
            const [result] = await db.query(`
            INSERT INTO users (username, password) VALUES (?,?);
            `, [username, password]);

            console.log(result)
            res.status(200).json({ message: "success" });
      } catch (error) {
            console.log(error)
            res.status(error.errno === 1062 ? 400 : 500).json({ message: "Server Error" })
      }
})

app.put("/users/username/:user_id", async (req, res) => {
      console.log(req.body)
      const user_id = req.params.user_id;
      const { username } = req.body
      try {
            const [result] = await db.query(`
            UPDATE users SET username = ?
            WHERE user_id = ?;
            `, [username, user_id]);

            console.log(result)
            res.status(200).json({ message: "success" });
      } catch (error) {
            console.log(error)
            res.status(error.errno === 1062 ? 400 : 500).json({ message: "Server Error" })
      }
})

app.put("/users/avatar/:user_id", async (req, res) => {
      console.log(req.body)
      const user_id = req.params.user_id;
      const { avatar } = req.body
      try {
            const [result] = await db.query(`
            UPDATE users SET avatar = ?
            WHERE user_id = ?;
            `, [avatar, user_id]);

            console.log(result)
            res.status(200).json({ message: "success" });
      } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error" })
      }
})

var rest_api_port = 4000;
app.listen(rest_api_port, () => {
      console.log("REST API started on : " + rest_api_port);
})

// Websocket
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
      cors: {
            origin: frontend_origin,
            credentials: true
      }
});

let words_hr = [];

const defaultGameSettings = {
      max_users: 5,
      round_time: 60,
      round_count: 5,
      hint_count: 2,
      custom_words: []
}

const defaultGameState = {
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

var rooms = {
      "public": {
            gameSettings: {
                  max_users: -1,
                  round_time: defaultGameSettings.round_time,
                  round_count: -1,
                  hint_count: 3,
                  custom_words: [],
            },
            gameState: {
                  admin_user_id: null,
                  started: true,
                  user_list: [],
                  drawing_user_id: null,
                  correct_guess_user_id_list: [],
                  total_points_user_id_map: {},
                  current_time: defaultGameState.current_time,
                  current_round: 1,
                  current_round_played_user_id_list: [],
                  current_word: null,
                  used_custom_words: [],
                  current_hints: 0,
            },
      },
}

const updateRooms = async () => {
      for (let [room_id, room] of Object.entries(rooms)) {
            if (room_id !== "public" && room.gameState.user_list.length === 0) {
                  delete rooms[room_id];
                  continue;
            }
            if (room.gameState.started) {
                  updateGame(room_id, room);
            }
      }
      setTimeout(updateRooms, 1000);
}

const endGame = async (room_id, room) => {
      room.gameState = {
            ...room.gameState,
            started: false,
            drawing_user_id: null,
            correct_guess_user_id_list: [],
            total_points_user_id_map: {},
            current_time: room.gameSettings.round_time,
            current_round: 1,
            current_round_played_user_id_list: [],
            current_word: null,
            used_custom_words: [],
            current_hints: 0,
      }
}

const startGame = async (room_id, room) => {
      room.gameState = {
            ...room.gameState,
            admin_user_id: room_id === "public" ? null : room.gameState.admin_user_id ?? room.gameState.user_list[0]?.user_id,
            started: true,
            drawing_user_id: room.gameState.user_list[0]?.user_id,
            correct_guess_user_id_list: [],
            total_points_user_id_map: {},
            current_time: room.gameSettings.round_time,
            current_round: 1,
            current_round_played_user_id_list: [],
            current_word: room.gameState.current_word ?? words_hr[Math.floor(Math.random() * words_hr.length)],
            used_custom_words: [],
            current_hints: 0,
      }
      io.to(room_id).emit('game-chat-message', {
            messages: [
                  'Igra je započela!',
                  `Idući crta ${room.gameState.user_list[0]?.username}`
            ]
      })
}
const startNextRound = async (room_id, room) => {
      io.to(room_id).emit('game-chat-message', {
            messages: [
                  // send message that next round is starting
                  `Runda ${room.gameState.current_round + 1} započela!`,
                  // send message that first user is drawing
                  `Idući crta ${room.gameState.user_list[0].username}.`
            ]
      })
      room.gameState.current_word = null;
      if (room.gameState.used_custom_words.length < room.gameSettings.custom_words) {
            room.gameState.used_custom_words.push(room.gameSettings.custom_words.find(custom_word => !(room.gameState.used_custom_words.includes(custom_word))))
            room.gameState.current_word = room.gameState.used_custom_words[room.gameState.used_custom_words.length - 1];
      }
      room.gameState = {
            ...room.gameState,
            drawing_user_id: room.gameState.user_list[0]?.user_id,
            correct_guess_user_id_list: [],
            current_time: room.gameSettings.round_time,
            current_round: room.gameState.current_round + 1,
            current_round_played_user_id_list: [],
            current_word: room.gameState.current_word ?? words_hr[Math.floor(Math.random() * words_hr.length)],
            current_hints: 0,
      }
}
const startNextUserTurn = async (room_id, room) => {
      // add current drawing user to played id list
      room.gameState.current_round_played_user_id_list.push(room.gameState.drawing_user_id)
      // set new drawing user id
      room.gameState.drawing_user_id = room.gameState.user_list.find(user => !(room.gameState.current_round_played_user_id_list.includes(user.user_id))).user_id
      // send message that next user is drawing
      io.to(room_id).emit('game-chat-message', {
            messages: [
                  `Idući crta ${room.gameState.user_list.find(user => user.user_id === room.gameState.drawing_user_id).username}.`
            ]
      })
      // set current word to custom word if not all are used up
      room.gameState.current_word = null;
      if (room.gameState.used_custom_words.length < room.gameSettings.custom_words) {
            room.gameState.used_custom_words.push(room.gameSettings.custom_words.find(custom_word => !(room.gameState.used_custom_words.includes(custom_word))))
            room.gameState.current_word = room.gameState.used_custom_words[room.gameState.used_custom_words.length - 1];
      }
      room.gameState = {
            ...room.gameState,
            correct_guess_user_id_list: [],
            current_time: room.gameSettings.round_time,
            current_word: room.gameState.current_word ?? words_hr[Math.floor(Math.random() * words_hr.length)],
            current_hints: 0,
      }
}
const startNextTick = async (room_id, room) => {
      room.gameState.current_time -= 1;
      // when the time progress is more than the hint progress, add a new hint

      // time 80 / 80 -> 0 / 80 -> 0%
      // time 40 / 60 -> 20 / 60 -> 33%

      // hints 0 / 1 -> 1 / 2 -> 50%
      // hints 3 / 5 -> 4 / 6 -> 66%
      const time_progress = (room.gameSettings.round_time - room.gameState.current_time) / (room.gameSettings.round_time)
      const hint_progress = (room.gameState.current_hints + 1) / (room.gameSettings.hint_count + 1)
      if (room.gameState.current_hints < room.gameSettings.hint_count && (time_progress >= hint_progress)) {
            room.gameState.current_hints += 1;
      }
}

const updateGame = async (room_id, room) => {
      let event_name = 'next-tick';
      // game ended
      // this either happens when the number of users is less than 2 at any point
      // or when the max rounds is not -1 and the current round exceeded the max rounds
      if (
            (room.gameState.user_list.length < 2)
            || (
                  room.gameSettings.round_count !== -1
                  && (room.gameState.current_round > room.gameSettings.round_count)
                  || (room.gameState.current_round === room.gameSettings.round_count && room.gameState.current_time <= 0)
            )) {
            endGame(room_id, room);
            event_name = 'game-over';
      }
      // current round user turn ended
      else if (room.gameState.current_time <= 0 && room.gameState.current_round_played_user_id_list.length < room.gameState.user_list.length - 1) {
            startNextUserTurn(room_id, room);
            event_name = 'next-user-turn';
      }
      // round ended
      else if (room.gameState.current_time <= 0) {
            startNextRound(room_id, room);
            event_name = 'next-round';
      }
      // update timer and hints
      else {
            startNextTick(room_id, room);
            event_name = 'next-tick';
      }

      io.to(room_id).emit('update-game-state', { gameState: room.gameState, event_name })

      console.log("ROOM:", room);
      console.log("EVENT:", event_name);
}

const updateSettings = async (room_id, room, gameSettings) => {
      room.gameSettings = gameSettings;
      io.to(room_id).emit('update-game-settings', { gameSettings: room.gameSettings })
}

io.on('connection', (socket) => {
      console.log('User Connected', socket.id);
      socket.on('join-room', ({ user, room_id, gameSettings }) => {
            console.log(user, room_id, gameSettings)
            // default to public room
            room_id = room_id ?? "public"
            // leave rooms the socket is already in except the provided one
            for (socket_room of Object.values(socket.rooms)) {
                  if (socket_room !== room_id) {
                        socket.leave(socket_room);
                  }
            }
            socket.join(room_id);

            // create the room in local list if it does not exist, also appoint the user as admin of the room in that case
            if (room_id !== "public" && rooms[room_id] == null) {
                  rooms[room_id] = {
                        gameSettings: gameSettings ?? defaultGameSettings,
                        gameState: {
                              ...defaultGameState,
                              admin_user_id: user?.user_id,
                              current_time: (gameSettings ?? defaultGameSettings).round_time,
                        }
                  }
            }
            // only add the user if he isn't already in the list
            if (rooms[room_id].gameState.user_list.findIndex(game_user => game_user.socket_id === socket.id || game_user?.user_id === user?.user_id) === -1) {
                  rooms[room_id].gameState.user_list.push({ ...user, socket_id: socket.id })
                  // start the public room game if at least 2 users are now in room
                  if (room_id === "public" && rooms[room_id].gameState.started === false && rooms[room_id].gameState.user_list.length > 1) {
                        startGame(room_id, rooms[room_id]);
                  }
            }
            io.to(room_id).emit('user-joined', { user, gameState: rooms[room_id].gameState });
      });

      socket.on('change-settings', ({ room_id, gameSettings }) => {
            if (room_id !== "public" && rooms[room_id] != null) {
                  updateSettings(room_id, rooms[room_id], gameSettings)
            }
      })

      socket.on('start-game', ({ user, room_id }) => {
            console.log(rooms)
            console.log(user, room_id)
            console.log(rooms[`${room_id}`])
            if (room_id !== "public" && rooms[room_id] != null && user?.user_id === rooms[room_id]?.gameState?.admin_user_id) {
                  startGame(room_id, rooms[room_id])
            }
      })

      socket.on('canvas-data', ({ data, id }) => {
            socket.broadcast.emit('canvas-data', { data, id });

      })

      socket.on('disconnect', function () {
            console.log('User Disconnected', socket.id);

            for (let [room_id, room] of Object.entries(rooms)) {
                  let user_index = room.gameState.user_list.findIndex(user => user.socket_id === socket.id)
                  if (user_index !== -1) {
                        let user = room.gameState.user_list[user_index];
                        room.gameState.user_list = room.gameState.user_list.filter((user, index) => index !== user_index)
                        io.to(room_id).emit('user-leave', { user, ...room })
                  }
            }
      });
})

var websocket_port = 5000;

// Load words list
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'words_hr.txt');

fs.readFile(filePath, { encoding: 'utf-8' }, async function (err, data) {
      if (!err) {
            data = data.trim().replace(/\r/g, "").split("\n");
            console.log('WORDS: \n', data);
            words_hr = data;
      } else {
            console.log(err);
      }
});

httpServer.listen(websocket_port, () => {
      console.log("Websocket started on : " + websocket_port);
      updateRooms();
})