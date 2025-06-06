const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io =new Server(server);
const path = require('path');


app.use(express.json());
app.use(express.static('build'));

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'))
})

const userSocketMap = {};


const ACTIONS = require('./src/Actions.js');
const dotenv = require('dotenv');

dotenv.config();

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log(socket.id, "socket connected");
    console.log("Total clients:", io.engine.clientsCount);
    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        console.log(clients, "clients in room", roomId);

        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId:socket.id

            })
        })
    })

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        console.log("receiving on server",code);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });

    })

    socket.on(ACTIONS.SYNC_CODE,({code,socketId})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});
    })

    socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                username:userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log("listening on port", PORT);
})