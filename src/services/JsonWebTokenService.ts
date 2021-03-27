import jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: number;
  name: string;
  username: string;
}

/** IMPORTANT: Only for use in NodeJS (on the server). */
export default class JsonWebTokenService {
  public static generateToken(payload: JwtPayload) {
    const secret = process.env.TOKEN_SECRET;

    if (!secret) {
      throw new Error('Unable to sign JSON Web Token as a secret key has not been configured.');
    }

    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  public static authenticateToken(token: string) {
    const secret = process.env.TOKEN_SECRET;

    if (!secret) {
      throw new Error(
        'Unable to authenticate JSON Web Token as a secret key has not been configured.'
      );
    }

    try {
      const decodedToken = jwt.verify(token, secret) as JwtPayload | undefined;

      if (!decodedToken) {
        return undefined;
      }

      return decodedToken;
    } catch {
      return undefined;
    }
  }
}
