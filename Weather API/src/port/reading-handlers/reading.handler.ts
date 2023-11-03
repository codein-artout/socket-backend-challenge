import { IncomingSensorReading } from "../../domain/IncomingSensorReading";
import { SensorType } from "../../domain/SensorType";

export interface ReadingHandler {

    process(reading: IncomingSensorReading): void

    handles(): SensorType

}