import { Server } from 'socket.io';

export default function sendNewMessage(io: Server) {
  io.on('connection', socket => {
    socket.on('broadcast_message', function (data: string) {
      io.emit('broadcast_message', data);
    });
  });
}
