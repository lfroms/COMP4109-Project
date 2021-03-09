import { Server } from 'socket.io';

export default function joinRoom(io: Server) {
  io.on('connection', socket => {
    // let currentRoom: any | null = null;
    socket.on('join_room', (chatId: string) => {
      // currentRoom = io.sockets.adapter.rooms[chatId];
      socket.join(chatId);
      console.log('Room Name:' + chatId);
    });
    socket.on('broadcast_message', (data: any) => {
      console.log(data);
      socket.to(data.room).emit('broadcast_message', data.message);
    });
  });
}
