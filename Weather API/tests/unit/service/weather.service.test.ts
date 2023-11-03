import { WeatherService } from '../../../src/service/weather.service';
import { WeatherReadingRepository } from '../../../src/repository/weather-reading.repository';
import { SensorType } from '../../../src/domain/SensorType';
import { Location } from '../../../src/domain/Location';
import { WeatherReading } from '../../../src/domain/WeatherReading';

// Mock the WeatherReadingRepository to avoid actual database calls
jest.mock('../../../src/repository/weather-reading.repository');

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let weatherRepositoryMock: jest.Mocked<WeatherReadingRepository>;

  beforeEach(() => {
    weatherService = new WeatherService();
    weatherRepositoryMock = {
        save: jest.fn(),
        getWeatherData: jest.fn(),
      } as Partial<WeatherReadingRepository> as jest.Mocked<WeatherReadingRepository>;
      weatherService.weatherRepo = weatherRepositoryMock;
  });

  it('should save weather data successfully', async () => {
    // Given
    weatherRepositoryMock.save.mockResolvedValue(true);
    const consoleLogSpy = jest.spyOn(console, 'log');

    const sensorId = '123';
    const value = 25;
    const measuredAt = new Date('2023-01-15T12:00:00');

    // When

    // await expect(weatherService.save(sensorId, value, measuredAt)).resolves.toBeUndefined();
    await weatherService.save(sensorId, value, measuredAt);

    // Then
    expect(weatherRepositoryMock.save).toHaveBeenCalledWith(
      sensorId,
      value,
      measuredAt
    );
    expect(consoleLogSpy).toHaveBeenCalledWith('Weather data saved successfully.');
  });

  it('should handle failed weather data saving', async () => {
    // Given
    weatherRepositoryMock.save.mockResolvedValue(false);
    const consoleErrorSpy = jest.spyOn(console, 'error');

    const sensorId = '123';
    const value = 25;
    const measuredAt = new Date('2023-01-15T12:00:00');

    // When
    await weatherService.save(sensorId, value, measuredAt);

    // Then
    expect(weatherRepositoryMock.save).toHaveBeenCalledWith(
        sensorId,
        value,
        measuredAt
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save weather data.');
  });

  it('should calculate average data correctly', async () => {
    // Given
    weatherRepositoryMock.getWeatherData.mockResolvedValue(dummyWeatherReadings());

    const type = SensorType.TEMPERATURE;
    const location = Location.LONDON;

    // When
    const result = await weatherService.getAverageData(type, location);

    // Then
    expect(weatherRepositoryMock.getWeatherData).toHaveBeenCalledWith(type, location, undefined, undefined);
    expect(result).toBe(25); 
  });

  it('should return null for average data when no readings are available', async () => {
    // Given
    weatherRepositoryMock.getWeatherData.mockResolvedValue([]);

    const type = SensorType.TEMPERATURE;
    const location = Location.LONDON;

    // When
    const result = await weatherService.getAverageData(type, location);

    // Then
    expect(weatherRepositoryMock.getWeatherData).toHaveBeenCalledWith(type, location, undefined, undefined);
    expect(result).toBeNull(); 
  });

  it('should return null for null return from repo', async () => {
    // Given
    weatherRepositoryMock.getWeatherData.mockResolvedValue(null);

    const type = SensorType.TEMPERATURE;
    const location = Location.LONDON;

    // When
    const result = await weatherService.getAverageData(type, location);

    // Then
    expect(weatherRepositoryMock.getWeatherData).toHaveBeenCalledWith(type, location, undefined, undefined);
    expect(result).toBeNull(); 
  });

  it('should calculate average data correctly within a time range', async () => {
    // Given
    const from = new Date();
    from.setHours(from.getHours() - 2);
    const to = new Date();
    to.setHours(to.getHours() - 1);
    weatherRepositoryMock.getWeatherData.mockResolvedValue(dummyWeatherReadings());
  
    const type = SensorType.TEMPERATURE;
    const location = Location.LONDON;
  
    // When
    const result = await weatherService.getAverageData(type, location, from, to);
  
    // Then
    expect(weatherRepositoryMock.getWeatherData).toHaveBeenCalledWith(type, location, from, to);
    expect(result).toBe(25); 
  });
  
  it('should return null for average data when no readings are available within a time range', async () => {
    // Given
    const from = new Date();
    from.setHours(from.getHours() - 2);
    const to = new Date();
    to.setHours(to.getHours() - 1);
    weatherRepositoryMock.getWeatherData.mockResolvedValue([]);
  
    const type = SensorType.TEMPERATURE;
    const location = Location.LONDON;
  
    // When
    const result = await weatherService.getAverageData(type, location, from, to);
  
    // Then
    expect(weatherRepositoryMock.getWeatherData).toHaveBeenCalledWith(type, location, from, to);
    expect(result).toBeNull(); // No readings available within the specified time range
  });
  
  it('should return null for null return from repo with from and to parameters', async () => {
    // Given
    const from = new Date();
    from.setHours(from.getHours() - 2);
    const to = new Date();
    to.setHours(to.getHours() - 1);
    weatherRepositoryMock.getWeatherData.mockResolvedValue(null);
  
    const type = SensorType.TEMPERATURE;
    const location = Location.LONDON;
  
    // When
    const result = await weatherService.getAverageData(type, location, from, to);
  
    // Then
    expect(weatherRepositoryMock.getWeatherData).toHaveBeenCalledWith(type, location, from, to);
    expect(result).toBeNull(); // Null return from the repository
  });

});

function dummyWeatherReadings(): WeatherReading[] {
    const currentTime = new Date();
    const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000); // 1 hour ago
    const twoHoursAgo = new Date(currentTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago

    return [
        {
            id: 1,
            value: 10,
            sensorId: 123,
            measuredAt: twoHoursAgo, 
        },
        {
            id: 2,
            value: 20,
            sensorId: 123,
            measuredAt: oneHourAgo,
        },
        {
            id: 3,
            value: 30,
            sensorId: 123,
            measuredAt: currentTime, 
        },
        {
            id: 4,
            value: 40,
            sensorId: 123,
            measuredAt: currentTime, 
        }
    ];
}

