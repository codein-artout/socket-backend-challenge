import { Request, Response } from 'express';
import { WeatherService } from '../service/weather.service';
import { SensorType } from '../domain/SensorType';
import { Location } from '../domain/Location';

export class WeatherController {

  static async getAverageData(req: Request, res: Response): Promise<void> {
    try {
      const { type, location, from, to } = req.query;
      if (!type || !location) {
        res.status(400).json({ error: 'Type and location are required.' });
        return;
      }

      const sensorType = type as SensorType;
      const locationId = location as Location; 

      // Parse from and to parameters if provided
      const fromDate = from ? new Date(from as string) : undefined;
      const toDate = to ? new Date(to as string) : undefined;

      const weatherService = new WeatherService();

      const averageData = await weatherService.getAverageData(sensorType, locationId, fromDate, toDate);
      if (averageData !== null) {
        res.status(200).json({ average: averageData });
      } else {
        res.status(404).json({ error: 'No average data found.' });
      }
    } catch (error) {
      console.error('Error in getAverageData:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }

  static async getTimeseriesData(req: Request, res: Response): Promise<void> {
    try {
        const { type, location, from, to } = req.query;
        if (!type || !location) {
            res.status(400).json({ error: 'Type and location are required.' });
            return;
        }

        const sensorType = type as SensorType;
        const locationId = location as Location; 

        // Parse from and to parameters if provided
        const fromDate = from ? new Date(from as string) : undefined;
        const toDate = to ? new Date(to as string) : undefined;

        const weatherService = new WeatherService();

        const timeseriesData = await weatherService.getTimeseriesData(sensorType, locationId, fromDate, toDate);
        if (timeseriesData && timeseriesData.length > 0) {
            res.status(200).json({ timeseries: timeseriesData });
        } else {
            res.status(404).json({ error: 'No timeseries data found.' });
        }
    } catch (error) {
        console.error('Error in getTimeseriesData:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

}
