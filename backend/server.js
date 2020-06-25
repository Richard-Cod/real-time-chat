const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');



const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors())




io.on('connect', (socket) => {
    console.log('a user connected');
    const date = new Date();

    socket.on('join',({room,name}) => {
        
    const bienvenue = {
        name : "admin",
        text:"Bienvenue au chat "+ name,
        createdAt : date.getHours() + " : " +date.getMinutes(),
    }

        socket.emit('message',{message : bienvenue});
        socket.join(room);
        socket.on('chatMessage',({text,sendeur}) => {
            const newMessage = {
                name:sendeur,
                text,
                createdAt : date.getHours() + " : " +date.getMinutes(),
            }

            io.to(room).emit('message',{message : newMessage})
        })

    })

    socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  });


app.get('/test', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  })

const PORT = process.env.port || 5000
server.listen(PORT, () => {
  console.log(`Serveur écoute sur le port ${PORT}`)
})

