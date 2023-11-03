import { Location } from "./Location";
import { SensorType } from "./SensorType";

export interface IncomingSensorReading {
    value: number;
    measuredAt: Date;
    sensorId: string;
    type: SensorType;
    // In a real-world scenario, a unique identifier for sensor will be used instead of the following fields

    /* type: SensorType; 
    location: Location; */
}