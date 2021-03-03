import { Router } from 'express';

const router = Router();

router.get('/ping', (request, response) => {
  return response.json({
    response: 'Pong',
    requestHeaders: request.headers,
  });
});

export default router;
