import pool from '../../../src/repository/DB';
import { SensorType } from '../../../src/domain/SensorType';
import { Location } from '../../../src/domain/Location';
import { Unit } from '../../../src/domain/Unit';
import { SensorRepository } from '../../../src/repository/sensor.repository';
import { Pool, PoolClient } from 'pg';
import { error } from 'console';

// Mock the WeatherReadingRepository to avoid actual database calls
jest.mock('../../../src/repository/DB');

describe('SensorRepository', () => {
  let sensorRepository: SensorRepository;

  beforeEach(() => {
    sensorRepository = new SensorRepository();
  });

  it('should save sensor data successfully', async () => {

    // Define test data
    const type = SensorType.TEMPERATURE;
    const location = Location.LONDON;
    const serialNumber = '12345';
    const units = Unit.CELSIUS;
    pool.connect = jest.fn().mockReturnThis();
    pool.query = jest.fn().mockReturnThis();
    (pool as any).release = jest.fn().mockReturnThis();
    (pool as any).query.mockResolvedValue({});

    // When
    const result = await sensorRepository.save(type, location, serialNumber, units);

    // Then
    expect(result).toBe(true); // Ensure that the save method returns true on success
    expect(pool.connect).toHaveBeenCalledTimes(1); // Ensure that connect was called once
    expect(pool.query).toHaveBeenCalledTimes(1); // Ensure that query was called once
    expect(pool.query).toHaveBeenCalledWith(
      `INSERT INTO Sensor (type, location, serial_number, units) VALUES ($1, $2, $3, $4)`,
      [type, location, serialNumber, units]
    );
  });

  it('should throw error if query fails', async () => {

    // Given
    const type = SensorType.TEMPERATURE;
    const location = Location.LONDON;
    const serialNumber = '12345';
    const units = Unit.CELSIUS;

    pool.connect = jest.fn().mockReturnThis();
    pool.query = jest.fn().mockReturnThis();
    (pool as any).release = jest.fn().mockReturnThis();

    const error = new Error("Dummy Error");
    (pool as any).query.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error');

    // When
    const result = await sensorRepository.save(type, location, serialNumber, units);

    // Then
    expect(result).toBe(false); // Ensure that the save method returns true on success
    expect(pool.connect).toHaveBeenCalledTimes(1); // Ensure that connect was called once
    expect(pool.query).toHaveBeenCalledTimes(1); // Ensure that query was called once
    expect(pool.query).toHaveBeenCalledWith(
      `INSERT INTO Sensor (type, location, serial_number, units) VALUES ($1, $2, $3, $4)`,
      [type, location, serialNumber, units]
    );
    expect(consoleSpy).toHaveBeenCalledWith('Error saving sensor data:', error);
  });


});

