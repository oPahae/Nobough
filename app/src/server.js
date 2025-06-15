const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN || 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Utilisateur connecté:', socket.id);

  //^ /////////////////////////////////////////////////////////////////////

  socket.on('join-room', ({ roomCode, userInfo }) => {
    socket.join(roomCode);
    
    if (!rooms.has(roomCode)) {
      rooms.set(roomCode, {
        participants: new Map(),
        professor: null
      });
    }
    
    const room = rooms.get(roomCode);
    
    const participant = {
      id: socket.id,
      ...userInfo,
      socketId: socket.id
    };
    
    room.participants.set(socket.id, participant);
    
    if (userInfo.role === 'professeur') {
      room.professor = socket.id;
    }
    
    console.log(`${userInfo.nom} ${userInfo.prenom} (${userInfo.role}) a rejoint la salle ${roomCode}`);
    socket.to(roomCode).emit('user-joined', participant);
    const allParticipants = Array.from(room.participants.values());
    socket.emit('room-participants', allParticipants);
    if (room.professor) {
      socket.emit('professor-info', room.participants.get(room.professor));
    }
  });

  //^ /////////////////////////////////////////////////////////////////////

  socket.on('webrtc-offer', ({ offer, targetSocketId, roomCode }) => {
    socket.to(targetSocketId).emit('webrtc-offer', {
      offer,
      senderSocketId: socket.id,
      roomCode
    });
  });

  //^ /////////////////////////////////////////////////////////////////////

  socket.on('webrtc-answer', ({ answer, targetSocketId, roomCode }) => {
    socket.to(targetSocketId).emit('webrtc-answer', {
      answer,
      senderSocketId: socket.id,
      roomCode
    });
  });
  
  //^ /////////////////////////////////////////////////////////////////////

  socket.on('webrtc-ice-candidate', ({ candidate, targetSocketId, roomCode }) => {
    socket.to(targetSocketId).emit('webrtc-ice-candidate', {
      candidate,
      senderSocketId: socket.id,
      roomCode
    });
  });
  
  //^ /////////////////////////////////////////////////////////////////////

  socket.on('start-screen-share', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room && room.professor === socket.id) {
      socket.to(roomCode).emit('professor-screen-share-started');
    }
  });
  
  //^ /////////////////////////////////////////////////////////////////////

  socket.on('stop-screen-share', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room && room.professor === socket.id) {
      socket.to(roomCode).emit('professor-screen-share-stopped');
    }
  });
  
  //^ /////////////////////////////////////////////////////////////////////

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
    
    rooms.forEach((room, roomCode) => {
      if (room.participants.has(socket.id)) {
        const participant = room.participants.get(socket.id);
        room.participants.delete(socket.id);
        
        if (room.professor === socket.id) {
          room.professor = null;
        }
        
        socket.to(roomCode).emit('user-left', {
          socketId: socket.id,
          userInfo: participant
        });

        if (room.participants.size === 0) {
          rooms.delete(roomCode);
        }
      }
    });
  });
  
  //^ /////////////////////////////////////////////////////////////////////

  socket.on('toggle-mute', ({ roomCode, isMuted }) => {
    const room = rooms.get(roomCode);
    if (room && room.participants.has(socket.id)) {
      const participant = room.participants.get(socket.id);
      participant.isMuted = isMuted;
      
      socket.to(roomCode).emit('participant-mute-changed', {
        socketId: socket.id,
        isMuted
      });
    }
  });
  
  //^ /////////////////////////////////////////////////////////////////////

  socket.on('toggle-hand-raise', ({ roomCode, isHandRaised }) => {
    const room = rooms.get(roomCode);
    if (room && room.participants.has(socket.id)) {
      const participant = room.participants.get(socket.id);
      if (participant.role === 'etudiant') {
        participant.isHandRaised = isHandRaised;
        
        io.to(roomCode).emit('participant-hand-changed', {
          socketId: socket.id,
          isHandRaised,
          participant
        });
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur WebRTC démarré sur le port ${PORT}`);
});