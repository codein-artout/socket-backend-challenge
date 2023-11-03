import { Request, Response } from 'express';
import { WeatherController } from '../../../src/controller/weather.controller';
import { WeatherService } from '../../../src/service/weather.service';
import { SensorType } from '../../../src/domain/SensorType';
import { Location } from '../../../src/domain/Location';

jest.mock('../../../src/service/weather.service');

describe('WeatherController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let weatherServiceMock: jest.Mocked<WeatherService>;

  beforeEach(() => {
    mockRequest = {
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
  });

  describe('Average', () => {
  it('should return average data when valid type and location are provided', async () => {
    // Given
    const date = new Date()
    mockRequest.query = {
        type: 'TEMPERATURE',
        location: 'LONDON',
        from: date.toUTCString(),
        to: date.toUTCString()
      };

    const averageData = 100;
    const weatherServiceMock = WeatherService.prototype;
    weatherServiceMock.getAverageData = jest.fn().mockResolvedValue(averageData)

    // When
    await WeatherController.getAverageData(mockRequest as Request, mockResponse as Response);

    // Then
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ average: averageData });
  });

   it('should return a 400 error when type or location is missing', async () => {
    // Arrange
    mockRequest.query = {
      type: 'TEMPERATURE'
    };

    // Act
    await WeatherController.getAverageData(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Type and location are required.',
    });
  });

  

  it('should return a 404 error when no average data is found', async () => {
   // Given
    mockRequest.query = {
        type: 'TEMPERATURE',
        location: 'LONDON'
      };

    const weatherServiceMock = WeatherService.prototype;
    weatherServiceMock.getAverageData = jest.fn().mockResolvedValue(null)

    // When
    await WeatherController.getAverageData(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'No average data found.',
    });
  });

  it('should return a 500 error when an internal error occurs', async () => {
    // Given
    mockRequest.query = {
      type: 'TEMPERATURE',
      location: 'LONDON'
    };
  const weatherServiceMock = WeatherService.prototype;
  weatherServiceMock.getAverageData = jest.fn().mockRejectedValue(new Error('Dummy'))

  // When
  await WeatherController.getAverageData(mockRequest as Request, mockResponse as Response);

  // Then
  expect(mockResponse.status).toHaveBeenCalledWith(500);
  expect(mockResponse.json).toHaveBeenCalledWith({
    error: 'Internal server error.',
  });
  }); 
  });

  describe('Timeseries', () => {
    it('should return timeseries data when valid type and location are provided', async () => {
      // Given
      const date = new Date();
      mockRequest.query = {
        type: 'TEMPERATURE',
        location: 'LONDON',
        from: date.toUTCString(),
        to: date.toUTCString(),
      };
  
      const timeseriesData = [{ measuredAt: date, value: 25.5 }];
      const weatherServiceMock = WeatherService.prototype;
      weatherServiceMock.getTimeseriesData = jest.fn().mockResolvedValue(timeseriesData);
  
      // When
      await WeatherController.getTimeseriesData(mockRequest as Request, mockResponse as Response);
  
      // Then
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ timeseries: timeseriesData });
    });
  
    it('should return a 400 error when type or location is missing', async () => {
      // Arrange
      mockRequest.query = {
        type: 'TEMPERATURE',
      };
  
      // Act
      await WeatherController.getTimeseriesData(mockRequest as Request, mockResponse as Response);
  
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Type and location are required.',
      });
    });
  
    it('should return a 404 error when no timeseries data is found', async () => {
      // Given
      mockRequest.query = {
        type: 'TEMPERATURE',
        location: 'LONDON',
      };
  
      const weatherServiceMock = WeatherService.prototype;
      weatherServiceMock.getTimeseriesData = jest.fn().mockResolvedValue([]);
  
      // When
      await WeatherController.getTimeseriesData(mockRequest as Request, mockResponse as Response);
  
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'No timeseries data found.',
      });
    });
  
    it('should return a 500 error when an internal error occurs', async () => {
      // Given
      mockRequest.query = {
        type: 'TEMPERATURE',
        location: 'LONDON',
      };
      const weatherServiceMock = WeatherService.prototype;
      weatherServiceMock.getTimeseriesData = jest.fn().mockRejectedValue(new Error('Dummy'));
  
      // When
      await WeatherController.getTimeseriesData(mockRequest as Request, mockResponse as Response);
  
      // Then
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error.',
      });
    });
  })
});

