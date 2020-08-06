//requiring needed modules/libraries
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
// importing function from module
const {generateMessage} = require('./utils/messages.js')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users.js')

//creating app and server
//the server is created explicitly because socketio takes the server object as arg
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//setting up server port and public directory for app
const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public')

//server is up, run server
app.use(express.static(publicDirPath))

//listen for connection events
io.on('connection', (socket) => {
    //tell me if there is a new connection
    console.log('new ws conn')

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({id: socket.id, username, room})

        if (error) {
            return callback(error)
        }

        // client joins room
        socket.join(user.room)
        //sends welcome message to client that just joined
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        //lets everyone else know another user joined
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} joined the chat room!`)) 
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
        })

        callback()
    })

    //message sending to server, prints message on page
    //callback prints to console if message is delivered
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    //listens for anyone disconnecting
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            //lets everyone know someone left
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} left!`)) 
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
            })
        }
    })

})

// makes sure server is listening at port that we set up earlier
server.listen(port, () => {
    console.log(`port: ${port}`)
})