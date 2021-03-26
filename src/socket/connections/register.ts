import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../../types';
import { User } from '../../models/User';
import { Connection } from '../../models/Connection';
import { log } from '../../helpers';

export default function register(_io: Server, socket: Socket) {
  socket.on(SocketEvent.REGISTER_CONNECTION, async (payload: ConnectionRegisterPayload) => {
    const { userId } = payload;

    const user = await User.findOne(userId);

    if (!user) {
      log(`Could not register connection for user ${userId} because the user was not found`, {
        title: 'Connection registration',
        severity: 'error',
      });

      return;
    }

    log(`Registering connection ${socket.id} with user ${userId}`, {
      title: 'Connection registration',
    });

    const connection = new Connection();
    connection.user = user;
    connection.socketId = socket.id;

    // If we've already saved the connection don't save it again.
    Connection.createQueryBuilder()
      .insert()
      .into(Connection)
      .values(connection)
      .onConflict(`("socketId") DO UPDATE SET "userId" = :userId`)
      .setParameter('userId', user.id)
      .execute();
  });
}
