import { Location } from "../../domain/Location";
import { IncomingSensorReading } from "../../domain/IncomingSensorReading";
import { SensorType } from "../../domain/SensorType";

export class IncomingSensorReadingTransformer {

    transform(reading: string): IncomingSensorReading {
        const jsonReading = JSON.parse(reading);
        return {
            value: jsonReading.value,
            measuredAt: jsonReading.measured_at,
            sensorId: jsonReading.sensor_id,
            type: jsonReading.type
        }
    }
}