import { WeatherService } from "../../service/weather.service";
import { IncomingSensorReading } from "../../domain/IncomingSensorReading";
import { SensorType } from "../../domain/SensorType";
import { ReadingHandler } from "./reading.handler";

export class HumidityReadingHandler implements ReadingHandler {
    weatherService: WeatherService;

    private readonly HUMIDITY_MIN_ANOMALY = 0;
    private readonly HUMIDITY_MAX_ANOMALY = 100;

    private totalHumidity = 0;
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
        return SensorType.HUMIDITY;
    }

    private isAnomaly(value: number): boolean {
        // Added a basic anomaly check for humidity. This logic can be changed based on the use case.
        return value < this.HUMIDITY_MIN_ANOMALY || value > this.HUMIDITY_MAX_ANOMALY;
    }

    private reportAnomaly(value: number): void {
        // In a real-world scenario, this would ideally report/send a notification about the anomaly
        console.log('Anomaly received in humidity: ', value);
    }

    private reportAverage(value: number): void {
        this.totalHumidity += value;
        this.readingCount++;
        const averageHumidity = (this.readingCount === 0) ? 0 : this.totalHumidity / this.readingCount;
        // In a real-world scenario, this would ideally report/send a notification about the new average
        console.log('Current average humidity: ', averageHumidity);
    }
}
