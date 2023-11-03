import { IncomingSensorReading } from '../../../../src/domain/IncomingSensorReading';
import { SensorType } from '../../../../src/domain/SensorType';
import { HumidityReadingHandler } from '../../../../src/port/reading-handlers/humidity-reading.handler';
import { WeatherService } from '../../../../src/service/weather.service';

// Mock the WeatherService to avoid actual database calls
jest.mock('../../../../src/service/weather.service');

describe('HumidityReadingHandler', () => {
  let humidityHandler: HumidityReadingHandler;
  let weatherServiceMock: jest.Mocked<WeatherService>;

  beforeEach(() => {
    humidityHandler = new HumidityReadingHandler();
    weatherServiceMock = {
      save: jest.fn(),
    } as Partial<WeatherService> as jest.Mocked<WeatherService>;
    humidityHandler.weatherService = weatherServiceMock;
  });

  it('should process normal humidity reading', () => {
    // Given
    const normalReading = {
      sensorId: '12345',
      value: 50.5,
      measuredAt: new Date(),
      type: SensorType.HUMIDITY,
    } as IncomingSensorReading;

    // When
    humidityHandler.process(normalReading);

    // Then
    expect(weatherServiceMock.save).toHaveBeenCalledWith(
      normalReading.sensorId,
      normalReading.value,
      normalReading.measuredAt
    );
  });

  it('should process humidity anomaly', () => {
    // Given
    const anomalyReading = {
      sensorId: '12345',
      value: 110.0, // Anomaly value
      measuredAt: new Date(),
      type: SensorType.HUMIDITY,
    };
    const consoleSpy = jest.spyOn(console, 'log');

    // When
    humidityHandler.process(anomalyReading);

    // Then
    expect(weatherServiceMock.save).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Anomaly received in humidity: ',
      anomalyReading.value
    );
  });

  it('should report average humidity', () => {
    // Given
    const readings: IncomingSensorReading[] = [
      { sensorId: '12345', value: 40.0, measuredAt: new Date(), type: SensorType.HUMIDITY },
      { sensorId: '12345', value: 45.0, measuredAt: new Date(), type: SensorType.HUMIDITY },
      { sensorId: '12345', value: 50.0, measuredAt: new Date(), type: SensorType.HUMIDITY },
    ];
    const consoleSpy = jest.spyOn(console, 'log')

    // When
    readings.forEach((reading) => humidityHandler.process(reading));

    // Then
    expect(consoleSpy).toHaveBeenCalledWith('Current average humidity: ', 45);
  });

  it('should handle only humidity', () => {
    // when
    const result = humidityHandler.handles()

    // Then
    expect(result).toBe(SensorType.HUMIDITY)
  });
});
