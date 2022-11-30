import express from 'express';
import routes from '../routes';

// middleware
import { deserializeUser } from '../middleware/deserializeUser';

export function createServer() {
  const app = express();

  app.use(express.json());
  app.use(deserializeUser);

  routes(app);
  return app;
}
