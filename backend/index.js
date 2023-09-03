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

var users = {}
var rooms = {
      "public": {
            max_users: -1,
            rounds: -1,
            round_time: 80,
            custom_words: '',
            hints: 3,
      },
}

io.on('connection', (socket) => {
      console.log('User Connected', socket.id);
      socket.on('login', ({ previousId, newId, username, room_id }) => {
            if (users?.[previousId] == null) {
                  console.log('New User Joined', username);
                  users[newId] = {
                        username
                  }
            }
            else {
                  console.log('User Joined', username);
                  delete users[previousId]
                  users[newId] = {
                        username
                  }
            }

            if (rooms?.[room_id] == null) {
                  //create new room
            }

            //join


            io.sockets.emit('user-joined', { userList: users, userId: newId });
            console.log(users)
            //socket.broadcast.to(roomName).emit('user_leave', {user_name: "johnjoe123"});
      });

      socket.on('canvas-data', ({ data, id }) => {
            socket.broadcast.emit('canvas-data', { data, id });

      })

      socket.on('disconnect', function () {
            console.log('User Disconnected', socket.id);
            const username = users[socket.id]["username"]
            delete users[socket.id]
            io.sockets.emit('user-leave', { userList: users, userId: socket.id, username });
            //socket.broadcast.to(roomName).emit('user_leave', {user_name: "johnjoe123"});
      });
})

var websocket_port = 5000;
httpServer.listen(websocket_port, () => {
      console.log("Websocket started on : " + websocket_port);
})