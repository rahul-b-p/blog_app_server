import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
});

redis.on('error', (err) => logger.error('Redis error:', err));

export default redis;
