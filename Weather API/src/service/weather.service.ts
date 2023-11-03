import { SensorType } from "../domain/SensorType";
import { WeatherReadingRepository } from "../repository/weather-reading.repository";
import { Location } from "../domain/Location";
import { WeatherReading } from "../domain/WeatherReading";

export class WeatherService {
    weatherRepo: WeatherReadingRepository

    constructor() {
        this.weatherRepo = new WeatherReadingRepository();
    }
    
    async save(sensorId: string, value: number, measuredAt: Date) {
        const success = await this.weatherRepo.save(sensorId, value, measuredAt);
        if (success) {
            console.log('Weather data saved successfully.');
          } else {
            console.error('Failed to save weather data.');
        }
    }

    async getAverageData(type: SensorType, location: Location, from?: Date, to?: Date): Promise<number | null> {
        const weatherReadings = await this.getTimeseriesData(type, location, from, to);
        if (!!weatherReadings && weatherReadings.length > 0) {
            const totalValue = weatherReadings.reduce((sum, reading) => sum + reading.value, 0);
            const averageValue = totalValue / weatherReadings.length;
            return averageValue;
        } else {
            return null;
        }
    }

    async getTimeseriesData(type: SensorType, location: Location, from?: Date, to?: Date): Promise<WeatherReading[]> {
        const weatherReadings = await this.weatherRepo.getWeatherData(type, location, from, to);
        return weatherReadings;
    }



}