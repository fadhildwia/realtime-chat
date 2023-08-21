const express = require('express')
const http = require('http');
const cors = require('cors')
const socket = require('socket.io')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user.route')
const messageRoutes = require('./routes/messages.route')

const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/api/messages', messageRoutes)

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB Connection Successful")
}).catch((err) => {
  console.log(err.message)
})

const server = http.createServer(app);

const io = socket(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN_URL,
    methods: ['GET', 'POST']
  }
})

global.onlineUsers = new Map()

io.on('connection', (socket) => {
  global.chatSocket = socket
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on('send-msg', (data) => {
    console.log('data', data)
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data.message)
    }
  })
})
