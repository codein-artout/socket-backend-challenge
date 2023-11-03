import * as dotenv from 'dotenv';
dotenv.config();

export const redisConfig = {
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_SOCKET_HOST,
    port: parseInt(process.env.REDIS_SOCKET_PORT),
  }
};