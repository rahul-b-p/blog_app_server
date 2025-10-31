import express from 'express';
import { morganLogger } from './utils/logger';
import env from './config/env';
import { errorHandler, notFoundHandler } from './middlewares';
import router from './routes';

const app = express();

app.set('port', env.PORT);

app.use(morganLogger);

app.use(express.json());

// Use your api routes
app.use('/api', router);

// not found handler
app.use(notFoundHandler);
// error handler
app.use(errorHandler);

export default app;
