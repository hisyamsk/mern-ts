import config from 'config';

import connectDB from './utils/connect';
import log from './utils/logger';
import { createServer } from './utils/createServer';
import { startMetricsServer } from './utils/metrics';

const PORT = config.get<number>('port');

const app = createServer();

app.listen(PORT, async () => {
  log.info(`listening on http://localhost:${PORT}`);

  await connectDB();
  startMetricsServer();
});
