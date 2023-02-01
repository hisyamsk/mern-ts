import { Request, Response } from 'express';
import client from 'prom-client';

const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const responseTimeMetricsMiddleware = (
  req: Request,
  res: Response,
  time: number
) => {
  if (req?.route?.path) {
    restResponseTimeHistogram.observe(
      {
        method: req.method,
        route: req.route.path,
        status_code: res.statusCode,
      },
      time * 1000
    );
  }
};

export default responseTimeMetricsMiddleware;
