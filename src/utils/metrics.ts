import express, { Request, Response } from 'express';
import client from 'prom-client';
import log from './logger';

const app = express();
const METRICS_PORT = 9000;

const databaseResponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation', 'success'],
});

export function startMetricsServer() {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();

  app.get('/metrics', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', client.register.contentType);

    return res.send(await client.register.metrics());
  });

  app.listen(METRICS_PORT, () => {
    log.info(`Metrics Server running at PORT:${METRICS_PORT}`);
  });
}
