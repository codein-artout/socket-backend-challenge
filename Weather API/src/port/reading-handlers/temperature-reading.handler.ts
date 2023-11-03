import { WeatherService } from "../../service/weather.service";
import { IncomingSensorReading } from "../../domain/IncomingSensorReading";
import { SensorType } from "../../domain/SensorType";
import { ReadingHandler } from "./reading.handler";

export class TemperatureReadingHandler implements ReadingHandler {
    weatherService: WeatherService

    private readonly TEMPERATURE_MIN_ANOMALY = 0;
    private readonly TEMPERATURE_MAX_ANOMALY = 60;

    private totalTemperature = 0;
    private readingCount = 0; 

    constructor() {
        this.weatherService = new WeatherService();
    }

    process(reading: IncomingSensorReading): void {
        if (this.isAnomaly(reading.value)) {
            this.reportAnomaly(reading.value);
        } else {
            this.weatherService.save(reading.sensorId, reading.value, reading.measuredAt);
            this.reportAverage(reading.value);
        }
        
    }

    handles(): SensorType {
        return SensorType.TEMPERATURE;
    }

    private isAnomaly(value: number): boolean {
        // Added a basic anomaly check for now. This logic can be changed based on the use case.
        return (value < this.TEMPERATURE_MIN_ANOMALY || value > this.TEMPERATURE_MAX_ANOMALY)
    }

    private reportAnomaly(value: number): void {
        // In a real-world scenario, this would ideally report/send a notification about the anomaly
        console.log('Anomaly received in temperature: ', value)
    }

    private reportAverage(value: number): void {
        this.totalTemperature +=  value
        this.readingCount++;
        const averageTemperature = (this.readingCount === 0) ? 0 : this.totalTemperature / this.readingCount;
        // In a real-world scenario, this would ideally report/send a notification about the new average
        console.log('Current average: ', averageTemperature)

    }
    
}