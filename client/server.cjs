// const { SOCKACTIONS }  = require("./src/actions")

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors")

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors())

//step1 to uniquely identify the socketId belongs to which user
const userSocketmap = {}

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: userSocketmap[socketId]
    }
  })
}


io.on("connection", (socket) => {

  socket.on('join', ({ roomId, username }) => {
    //we can also acheive the same by this code also userSocketmap(...userSocket, [socket.id]:username)
    userSocketmap[socket.id] = username;
    socket.join(roomId)
    const clients = getAllConnectedClients(roomId)
    clients.forEach(({socketId})=>{
      socket.to(socketId).emit('joined',{
        clients,
        username,
        socketId: socket.id
      })
    })
  })

  socket.on('code-change',({roomId, code})=>{
    // socket.in(roomId).emit('code-change',{code}) this was used by instructor meaning send to all present in the room except me

    io.to(roomId).emit('code-change',{code})
  })

  socket.on('sync-code',({socket_Id, code})=>{
    // socket.in(roomId).emit('code-change',{code}) this was used by instructor meaning send to all present in the room except me
    console.log("connecting")
    io.to(socket_Id).emit('code-change',{code})
  })

  socket.on("disconnecting",()=>{
    const rooms = [...socket.rooms];
    rooms.forEach((roomId)=>{
      socket.in(roomId).emit('disconnected',{
        socketId: socket.id,
        username: userSocketmap[socket.id]
      })
    })
    delete userSocketmap[socket.id];
    socket.leave()
  })

});



const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`Server is running at the port ${PORT}`);
});



