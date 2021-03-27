import { Router } from 'express';
import { JsonWebTokenService } from '../services';
import { User } from '../models/User';

const router = Router();

type Request = API.AuthenticationRequestBody;
type Response = API.JSONResponse<API.AuthenticationResponse>;

router.post<any, Response, Request>('/api/auth', async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({
      data: null,
      error: {
        code: 400,
        message: 'Malformed request body',
      },
    });
  }

  const user = await User.findOne({ username, password }, { select: ['id', 'username', 'name'] });

  if (!user) {
    return response.status(500).json({
      data: null,
      error: {
        code: 400,
        message: 'The username or password is incorrect',
      },
    });
  }

  const token = JsonWebTokenService.generateToken({
    sub: user.id,
    username: user.username,
    name: user.name,
  });

  return response.json({
    data: {
      token,
    },
    error: null,
  });
});

export default router;
