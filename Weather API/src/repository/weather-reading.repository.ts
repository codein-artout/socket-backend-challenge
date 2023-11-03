import { SensorType } from '../domain/SensorType';
import  pool from './DB';
import { Location } from '../domain/Location';
import { Pool, QueryResult } from 'pg';
import { WeatherReading } from '../domain/WeatherReading';

export class WeatherReadingRepository {
    private readonly pool: Pool;

    constructor() {
        this.pool = pool;
    }

    public async save(sensorId: string, value: number, measuredAt: Date): Promise<boolean> {
      const query = `INSERT INTO Weather (sensor_id, value, measured_at) VALUES ($1, $2, $3)`
      const client = await pool.connect()
      try {
        const result = await client.query(
          query,
          [sensorId, value, measuredAt]
        );
        return true;
      } catch (error) {
        console.error('Error saving weather data:', error);
        return false; // The insertion failed
      } finally {
        client.release();
      }
    }

    public async getWeatherData(type: SensorType, location: Location, from?: Date, to?: Date): Promise<WeatherReading[] | null> {
      const sensorQuery = `SELECT id FROM Sensor WHERE type = $1 AND location = $2`;
      let weatherQuery = `SELECT * FROM Weather WHERE sensor_id = $1`;
      const sensorQueryParams: any[] = [type, location];
      const weatherQueryParams: any[] = [];

  
      const client = await this.pool.connect();
      try {
          const sensorResult: QueryResult = await client.query(sensorQuery, sensorQueryParams);
  
          if (sensorResult.rows.length === 0) {
              console.error('No sensors found');
              return null;
          }
  
          const sensorId: string = sensorResult.rows[0].id;
          weatherQueryParams.push(sensorId);
          if (!!from) {
            weatherQuery += ` AND measured_at >= $${weatherQueryParams.length + 1}`;
            weatherQueryParams.push(from);
          } 
          if (!!to) {
            weatherQuery += ` AND measured_at <= $${weatherQueryParams.length + 1}`;
            weatherQueryParams.push(to);
          }
          const weatherResult: QueryResult = await client.query(weatherQuery, weatherQueryParams);
          const weatherData: WeatherReading[] = weatherResult.rows.map((row) => ({
              id: row.id,
              sensorId: row.sensor_id,
              value: parseFloat(row.value), // Parse 'value' as a number
              measuredAt: row.measured_at,
          }));
  
          return weatherData;
      } catch (error) {
          console.error('Error fetching weather data:', error);
          return null;
      } finally {
          client.release();
      }
  }



}



