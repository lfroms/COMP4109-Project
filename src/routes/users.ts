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

  if (!ids || !ids.split(',')) {
    return response.status(400).json({
      data: null,
      error: {
        code: 400,
        message: 'Malformed query parameters',
      },
    });
  }

  const users = await User.findByIds(ids.split(','));

  return response.json({
    data: {
      users,
    },
    error: null,
  });
});

export default router;
