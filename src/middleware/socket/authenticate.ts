import { JsonWebTokenService } from '../../services';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export default function authenticate(
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) {
  const token = socket.handshake.query.token as string | undefined;

  if (!token) {
    next(new Error('Token not specified in socket handshake'));

    return;
  }

  const tokenPayload = JsonWebTokenService.authenticateToken(token);

  if (!tokenPayload) {
    next(new Error('Token expired or invalid'));

    return;
  }

  next();
}
