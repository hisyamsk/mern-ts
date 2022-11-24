import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

async function connectDB() {
  const dbUri = config.get<string>('dbUri');

  try {
    await mongoose.connect(dbUri);
    log.info('db connected');
  } catch (error) {
    log.error('could not connect to db');
    process.exit(1);
  }
}

export default connectDB;
