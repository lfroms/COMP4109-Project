import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

type Request = API.RegistrationRequestBody;
type Response = API.JSONResponse<API.UserResponse>;

router.post<any, Response, Request>('/api/register', async (request, response) => {
  const { name, password, publicKey } = request.body;

  if (!name || !password || !publicKey) {
    return response.status(400).json({
      data: null,
      error: {
        code: 400,
        message: 'Malformed request body',
      },
    });
  }

  const user = new User();
  user.name = name;
  user.password = password;
  user.publicKey = publicKey;

  await user.save();

  return response.json({
    data: {
      user,
    },
    error: null,
  });
});

export default router;
