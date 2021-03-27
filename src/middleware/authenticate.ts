import { Router } from 'express';
import { JsonWebTokenService } from '../services';
import 'colors';

const router = Router();

router.use<any, API.JSONResponse<null>>((request, response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return response.status(401).json({
      data: null,
      error: {
        code: 401,
        message: 'Unauthorized',
      },
    });
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return response.status(401).json({
      data: null,
      error: {
        code: 401,
        message: 'Unauthorized',
      },
    });
  }

  const tokenPayload = JsonWebTokenService.authenticateToken(token);

  if (!tokenPayload) {
    return response.status(401).json({
      data: null,
      error: {
        code: 401,
        message: 'Unauthorized',
      },
    });
  }

  return next();
});

export default router;
