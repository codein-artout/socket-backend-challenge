import { Unit } from "./Unit";
import { SensorType } from "./SensorType";

export interface WeatherReading {
    id: number;
    value: number;
    sensorId: number;
    measuredAt: Date;
}