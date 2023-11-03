import { IncomingSensorReading } from '../../../../src/domain/IncomingSensorReading';
import { SensorType } from '../../../../src/domain/SensorType';
import { TemperatureReadingHandler } from '../../../../src/port/reading-handlers/temperature-reading.handler';
import { WeatherService } from '../../../../src/service/weather.service';

// Mock the WeatherService to avoid actual database calls
jest.mock('../../../../src/service/weather.service');

describe('TemperatureReadingHandler', () => {
  let temperatureHandler: TemperatureReadingHandler;
  let weatherServiceMock : jest.Mocked<WeatherService>

  beforeEach(() => {
    temperatureHandler = new TemperatureReadingHandler();
    weatherServiceMock = {
        save: jest.fn()
    } as Partial<WeatherService> as jest.Mocked<WeatherService>
    temperatureHandler.weatherService = weatherServiceMock;
  });

  it('should process normal temperature reading', () => {
    // Given
    const normalReading = {
      sensorId: '12345',
      value: 25.5,
      measuredAt: new Date(),
      type: SensorType.TEMPERATURE
    } as IncomingSensorReading;

    // When
    temperatureHandler.process(normalReading);

    // Then
    expect(weatherServiceMock.save).toHaveBeenCalledWith(
      normalReading.sensorId,
      normalReading.value,
      normalReading.measuredAt
    );
  });

  it('should process temperature anomaly', () => {
    // Given
    const anomalyReading = {
      sensorId: '12345',
      value: 70.0, // Anomaly value
      measuredAt: new Date(),
      type: SensorType.TEMPERATURE
    };
    const consoleSpy = jest.spyOn(console, 'log');

    // When
    temperatureHandler.process(anomalyReading);

    // Then
    expect(weatherServiceMock.save).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Anomaly received in temperature: ',
      anomalyReading.value
    );
  });

  it('should report average temperature', () => {
    // Given
    const readings: IncomingSensorReading[] = [
      { sensorId: '12345', value: 25.0, measuredAt: new Date(), type: SensorType.TEMPERATURE },
      { sensorId: '12345', value: 30.0, measuredAt: new Date(), type: SensorType.TEMPERATURE },
      { sensorId: '12345', value: 35.0, measuredAt: new Date(), type: SensorType.TEMPERATURE },
    ];
    const consoleSpy = jest.spyOn(console, 'log')

    // When
    readings.forEach((reading) => temperatureHandler.process(reading));

    // Then
    expect(consoleSpy).toHaveBeenCalledWith('Current average: ', 30);
  });

  it('should handle only temperature', () => {
    // when
    const result = temperatureHandler.handles()

    // Then
    expect(result).toBe(SensorType.TEMPERATURE)
  });
});
