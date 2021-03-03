import { Server } from 'socket.io';
import { log } from '../../helpers';

export default function printNewConnection(io: Server) {
  io.on('connection', () => {
    log('New socket connection', { title: 'SOCKET' });
  });
}
