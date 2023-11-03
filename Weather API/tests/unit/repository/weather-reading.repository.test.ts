import { WeatherReadingRepository } from '../../../src/repository/weather-reading.repository'; // Adjust the import path as needed
import { Pool, QueryResult } from 'pg';
import { WeatherReading } from '../../../src/domain/WeatherReading';
import pool from '../../../src/repository/DB'; // Import your DB connection or mock
import { SensorType } from '../../../src/domain/SensorType';
import { Location } from '../../../src/domain/Location';

// Mock the database connection
jest.mock('../../../src/repository/DB');

describe('WeatherReadingRepository', () => {
  let weatherReadingRepository: WeatherReadingRepository;

  beforeEach(() => {
    weatherReadingRepository = new WeatherReadingRepository();
  });

  describe('save', () => {
    it('should save weather reading successfully', async () => {
        // Given
        const sensorId = '123';
        const value = 25.5;
        const measuredAt = new Date();
        pool.connect = jest.fn().mockReturnThis();
        pool.query = jest.fn().mockReturnThis();
        (pool as any).release = jest.fn().mockReturnThis();
        (pool as any).query.mockResolvedValue({});

        // When
        const result = await weatherReadingRepository.save(sensorId, value, measuredAt);

        // Then
        expect(result).toBe(true); // Ensure that the save method returns true on success
        expect(pool.connect).toHaveBeenCalledTimes(1); // Ensure that connect was called once
        expect(pool.query).toHaveBeenCalledTimes(1); // Ensure that query was called once
        expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO Weather (sensor_id, value, measured_at) VALUES ($1, $2, $3)`,
        [sensorId, value, measuredAt]
      );
    });

    it('should throw error if query fails', async () => {
      // Given
      const sensorId = '123';
      const value = 25.5;
      const measuredAt = new Date();
      pool.connect = jest.fn().mockReturnThis();
      pool.query = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      const error = new Error("Dummy Error");
      (pool as any).query.mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error');

      // When
      const result = await weatherReadingRepository.save(sensorId, value, measuredAt);

      // Then
      expect(result).toBe(false); // Ensure that the save method returns false on error
      expect(pool.connect).toHaveBeenCalledTimes(1); // Ensure that connect was called once
      expect(pool.query).toHaveBeenCalledTimes(1); // Ensure that query was called once
      expect(consoleSpy).toHaveBeenCalledWith('Error saving weather data:', error);
    });
  });

  describe('getWeatherData', () => {
    it('should return weather data for a given sensor type and location', async () => {
      // Given
      const type = SensorType.TEMPERATURE
      const location = Location.LONDON
      const fakeSensorId = 'fakeSensorId';
      const date = new Date();
      pool.connect = jest.fn().mockReturnThis();
      pool.query = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query.mockResolvedValueOnce({
        rows: [{id: fakeSensorId}]
      }).mockResolvedValueOnce({
        rows: dummyWeatherRows(date, date)
      });

      // When
      const result = await weatherReadingRepository.getWeatherData(type, location);

      // Then
      expect(result).toEqual(dummyWeatherReadings(date, date)); // Ensure that the result matches the fake data
      expect(pool.connect).toHaveBeenCalledTimes(1); // Ensure that connect was called once
      expect(pool.query).toHaveBeenCalledTimes(2); // Ensure that query was called twice
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        `SELECT id FROM Sensor WHERE type = $1 AND location = $2`,
        [type, location]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        `SELECT * FROM Weather WHERE sensor_id = $1`,
        [fakeSensorId]
      );
    });

    it('should return null if query fails', async () => {
      // Given
      const type = SensorType.TEMPERATURE
      const location = Location.LONDON
      const consoleSpy = jest.spyOn(console, 'error')
      pool.connect = jest.fn().mockReturnThis();
      pool.query = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      const error = new Error('Dumy Error');
      (pool as any).query.mockRejectedValue(error);

      // When
      const result = await weatherReadingRepository.getWeatherData(type, location);

      // Then
      expect(result).toBeNull(); // Ensure that the save method returns false on error
      expect(pool.connect).toHaveBeenCalledTimes(1); // Ensure that connect was called once
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching weather data:', error);
      
    });

    it('should return null if no sensors are found for the given type and location', async () => {
      // Given
      const type = SensorType.TEMPERATURE
      const location = Location.LONDON
      const consoleSpy = jest.spyOn(console, 'error')
      pool.connect = jest.fn().mockReturnThis();
      pool.query = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query.mockResolvedValueOnce({
        rows: []
      });

      // When
      const result = await weatherReadingRepository.getWeatherData(type, location);

      // Then
      expect(result).toBeNull(); // Ensure that the save method returns false on error
      expect(pool.connect).toHaveBeenCalledTimes(1); // Ensure that connect was called once
      expect(consoleSpy).toHaveBeenCalledWith('No sensors found');
    });

    it('should return weather data within a time range for a given sensor type and location', async () => {
      // Given
      const type = SensorType.TEMPERATURE;
      const location = Location.LONDON;
      const fakeSensorId = 'fakeSensorId';
      const fromDate = new Date('2023-10-30T22:09:36.853Z');
      const toDate = new Date('2023-10-30T22:10:16.901Z');
      pool.connect = jest.fn().mockReturnThis();
      pool.query = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query.mockResolvedValueOnce({
        rows: [{ id: fakeSensorId }]
      }).mockResolvedValueOnce({
        rows: dummyWeatherRows(fromDate, toDate)
      });
  
      // When
      const result = await weatherReadingRepository.getWeatherData(type, location, fromDate, toDate);
  
      // Then
      expect(result).toEqual(dummyWeatherReadings(fromDate, toDate)); // Ensure that the result matches the fake data within the time range
      expect(pool.connect).toHaveBeenCalledTimes(1); // Ensure that connect was called once
      expect(pool.query).toHaveBeenCalledTimes(2); // Ensure that query was called twice
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        `SELECT id FROM Sensor WHERE type = $1 AND location = $2`,
        [type, location]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        `SELECT * FROM Weather WHERE sensor_id = $1 AND measured_at >= $2 AND measured_at <= $3`,
        [fakeSensorId, fromDate, toDate]
      );
    });
  }); 
});

function dummyWeatherReadings(fromDate: Date, toDate: Date): WeatherReading[] {
  return [
    {
      id: 1,
      value: 10,
      sensorId: 123,
      measuredAt: new Date(fromDate.getTime() + 1000), // Within the time range
    },
    {
      id: 2,
      value: 20,
      sensorId: 123,
      measuredAt: new Date(fromDate.getTime() + 2000), // Within the time range
    },
    {
      id: 3,
      value: 30,
      sensorId: 123,
      measuredAt: new Date(fromDate.getTime() + 3000), // Within the time range
    },
    {
      id: 4,
      value: 40,
      sensorId: 123,
      measuredAt: new Date(toDate.getTime() - 1000), // Within the time range
    },
    {
      id: 5,
      value: 50,
      sensorId: 123,
      measuredAt: new Date(toDate.getTime() - 2000), // Within the time range
    },
  ];
}

function dummyWeatherRows(fromDate: Date, toDate: Date): any[] {
  return [
    {
      id: 1,
      value: 10,
      sensor_id: 123,
      measured_at: new Date(fromDate.getTime() + 1000), // Within the time range
    },
    {
      id: 2,
      value: 20,
      sensor_id: 123,
      measured_at: new Date(fromDate.getTime() + 2000), // Within the time range
    },
    {
      id: 3,
      value: 30,
      sensor_id: 123,
      measured_at: new Date(fromDate.getTime() + 3000), // Within the time range
    },
    {
      id: 4,
      value: 40,
      sensor_id: 123,
      measured_at: new Date(toDate.getTime() - 1000), // Within the time range
    },
    {
      id: 5,
      value: 50,
      sensor_id: 123,
      measured_at: new Date(toDate.getTime() - 2000), // Within the time range
    },
  ];
}

