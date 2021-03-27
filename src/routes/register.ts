import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

type Request = API.RegistrationRequestBody;
type Response = API.JSONResponse<API.UserResponse>;

router.post<any, Response, Request>('/api/register', async (request, response) => {
  const { name, username, password, publicKey } = request.body;

  if (!name || !username || !password || !publicKey) {
    return response.status(400).json({
      data: null,
      error: {
        code: 400,
        message: 'Malformed request body',
      },
    });
  }

  const existingUser = await User.findOne({ username }, { select: ['id'] });

  if (existingUser) {
    return response.status(400).json({
      data: null,
      error: {
        code: 400,
        message: 'A user with this username already exists',
      },
    });
  }

  const user = new User();
  user.name = name;
  user.username = username;
  user.password = password;
  user.publicKey = publicKey;

  await user.save();

  return response.json({
    data: {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        publicKey: user.publicKey,
      },
    },
    error: null,
  });
});

export default router;
