import express from 'express';
import { morganLogger } from './utils/logger';
import env from './config/env';
import { errorHandler, notFoundHandler } from './middlewares';
import router from './routes';
import redis from './config/redis';

const app = express();

app.set('port', env.PORT);

app.use(morganLogger);

app.use(express.json());

// redis helth check
app.get('/health/redis', async (req, res) => {
  try {
    await redis.ping();
    res.json({ status: 'OK', redis: 'connected' });
  } catch {
    res.status(500).json({ status: 'ERROR', redis: 'disconnected' });
  }
});

// Use your api routes
app.use('/api', router);

// not found handler
app.use(notFoundHandler);
// error handler
app.use(errorHandler);

export default app;
