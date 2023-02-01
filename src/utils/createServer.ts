import express from 'express';
import cors from 'cors';
import config from 'config';
import routes from '../routes';

// middleware
import { deserializeUser } from '../middleware/deserializeUser';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import responseTimeMetricsMiddleware from '../middleware/metrics/responseTimeMetrics';

export function createServer() {
  const app = express();

  app.use(
    cors({
      origin: config.get<string>('origin'),
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(deserializeUser);
  app.use(responseTime(responseTimeMetricsMiddleware));

  routes(app);
  return app;
}
