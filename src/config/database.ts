import mongoose from 'mongoose';
import env from './env';
import { logger } from '../utils/logger';

export const connectDB = async () => {
  try {
    const mongoConnect = await mongoose.connect(env.MONGODB_URI);
    logger.info(`Mongo DB Connected: ${mongoConnect.connection.host} `);

    mongoose.connection.on('disconnected', () => {
      logger.info('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.info('MongoDB connection error:', err);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`DB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};
