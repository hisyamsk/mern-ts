import express from 'express';
import config from 'config';

import connectDB from './utils/connect';
import log from './utils/logger';

import routes from './routes';

const PORT = config.get<number>('port');

const app = express();

app.use(express.json());

app.listen(PORT, async () => {
  log.info(`listening on http://localhost:${PORT}`);

  await connectDB();

  routes(app);
});
