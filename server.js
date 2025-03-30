const express = require('express');
const http = require("http");
require('dotenv').config();

const app = express()
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "*",    
    }
})

io.on("connection", (socket) => {
    console.log(`User is connected with id: ${socket.id}`);
  
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room: ${roomId}`);
    });
        
    socket.on('sendMessage', async ({ room, message, senderId }) => {
        console.log("sendMessage event received:", { room, message, senderId });

        io.to(room).emit('newMessage', {
            chatRoomId: room,
            message,
            createdAt: new Date(),
            senderId
        });
        // try {
        //     const apiURL = `${process.env.API_URL}/api/users/${senderId}`;
        //     console.log("Fetching sender data from:", apiURL);
        //     const response = await fetch(apiURL);
        //     console.log("Response received:", response.status);
        //     if (!response.ok) {
        //         console.error("Non-OK response:", response.status);
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     const userData = await response.json();
        //     console.log(`Populated sender data:`, userData);
            
        // } catch (error) {
        //     console.error("Error fetching user data for senderId:", error);
        // }
    });
    
    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
})

server.listen(3001, () => {
    console.log("Server is running on port 3001")
})