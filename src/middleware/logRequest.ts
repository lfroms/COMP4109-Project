import { Router } from 'express';

const router = Router();

router.use((request, response, next) => {
  const statusColor = response.statusCode === 200 ? '\x1b[36m' : '\x1b[31m';

  const date = `\x1b[2m[${new Date().toISOString()}]\x1b[0m`;
  const status = `${statusColor}(${response.statusCode})`;
  const method = `\x1b[32m${request.method}\x1b[0m:`;
  const url = request.originalUrl;

  console.log(date, status, method, url);
  next();
});

export default router;
