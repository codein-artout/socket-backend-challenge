import { SensorService } from '../../../src/service/sensor.service';
import { SensorRepository } from '../../../src/repository/sensor.repository';
import { SensorType } from '../../../src/domain/SensorType';
import { Location } from '../../../src/domain/Location';
import { Unit } from '../../../src/domain/Unit';

// Mock the WeatherReadingRepository to avoid actual database calls
jest.mock('../../../src/repository/sensor.repository');

describe('SensorService', () => {
  let sensorService: SensorService;
  let sensorRepositoryMock: jest.Mocked<SensorRepository>;

  beforeEach(() => {
    sensorService = new SensorService();
    sensorRepositoryMock = {
        save: jest.fn()
      } as Partial<SensorRepository> as jest.Mocked<SensorRepository>;
      sensorService.sensorRepository = sensorRepositoryMock;
  });

  it('should register a sensor successfully', async () => {
    // Given
    sensorRepositoryMock.save.mockResolvedValue(true);
    const consoleLogSpy = jest.spyOn(console, 'log');

    const type = SensorType.TEMPERATURE;
    const location = Location.LONDON;
    const units = Unit.CELSIUS;

    // When
    await sensorService.registerSensor(type, location, units);

    // Then
    expect(sensorRepositoryMock.save).toHaveBeenCalledWith(
        type,
        location,
        expect.any(String),
        units
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('Sensor data saved successfully.');
  });

  it('should handle failed sensor registration', async () => {
     // Given
     sensorRepositoryMock.save.mockResolvedValue(false);
     const consoleErrorSpy = jest.spyOn(console, 'error');
 
     const type = SensorType.TEMPERATURE;
     const location = Location.LONDON;
     const units = Unit.CELSIUS;
 
     // When
     await sensorService.registerSensor(type, location, units);
 
     // Then
     expect(sensorRepositoryMock.save).toHaveBeenCalledWith(
         type,
         location,
         expect.any(String),
         units
     );
     expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save sensor data.');
  });

});

