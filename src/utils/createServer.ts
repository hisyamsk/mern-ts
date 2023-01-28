import express from 'express';
import cors from 'cors';
import config from 'config';
import routes from '../routes';

// middleware
import { deserializeUser } from '../middleware/deserializeUser';

export function createServer() {
  const app = express();

  app.use(
    cors({
      origin: config.get<string>('origin'),
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(deserializeUser);

  routes(app);
  return app;
}
