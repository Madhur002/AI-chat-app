import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { getBotResponse } from './bot.js'; // Update the path
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('userMessage', async (data) => {
    const userMessage = data.text;
    const botResponse = await getBotResponse(userMessage);
    socket.emit('message', { text: botResponse });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
