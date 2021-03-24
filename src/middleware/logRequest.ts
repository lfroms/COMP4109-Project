import { Router } from 'express';
import { log } from '../helpers';
import 'colors';

const router = Router();

router.use((request, response, next) => {
  const statusString = `(${response.statusCode})`;
  const status = response.statusCode === 200 ? statusString.green : statusString.red;

  const method = request.method.blue;
  const url = request.originalUrl;

  if (url.indexOf('_next') !== -1) {
    next();

    return;
  }

  log(`${status} ${method} ${url}`);
  next();
});

export default router;
