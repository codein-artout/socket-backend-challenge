import express, { NextFunction, Request, Response } from 'express';
import weatherRoute from './routes/weather.route'
import { Setup } from './setup';
import { SensorDataConsumer } from './port/sensor-data-consumer';
import * as dotenv from 'dotenv';

dotenv.config()
const apiKey = process.env.API_KEY // In real-world scenario, we will use stronger keys
const port = process.env.PORT


const app = express();
const setup = new Setup();
const sensorDataConsumer = new SensorDataConsumer();

const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const key = req.header('Authorization');

  if (!key || apiKey !== key) {
    return res.status(401).json({ message: 'Unauthorized. Invalid API key.' });
  }

  next();
};

app.use(apiKeyMiddleware);
app.use('/weather', weatherRoute);

// start the server
app.listen(port, () => {
  console.log(`server running : http://localhost:${port}`);
});