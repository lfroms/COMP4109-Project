import { Router } from 'express';
import { authenticate } from '../middleware';
import { User } from '../models/User';

const router = Router();

router.get('/api/users', authenticate);

interface Request {
  ids?: string;
}

type Response = API.JSONResponse<API.UsersResponse>;

router.get<any, Response, any, Request>('/api/users', async (request, response) => {
  const { ids } = request.query;

  const users = ids ? await User.findByIds(ids.split(',')) : await User.find();

  return response.json({
    data: {
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        publicKey: user.publicKey,
      })),
    },
    error: null,
  });
});

export default router;
