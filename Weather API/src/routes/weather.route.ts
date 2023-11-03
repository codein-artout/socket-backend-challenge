import Router from 'express';
import { WeatherController } from '../controller/weather.controller';

const router = Router();

router.get('/average', WeatherController.getAverageData);
router.get('/timeseries', WeatherController.getTimeseriesData);

export default router;