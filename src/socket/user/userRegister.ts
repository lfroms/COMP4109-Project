import { Server } from 'socket.io';

export default function userRegister(io: Server) {
  io.on('connection', socket => {
    socket.on('register_user', (userName: string) => {
      io.emit('register_user', userName);
      console.log('username: ' + userName);
    });
  });
}
