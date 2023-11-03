import { Location } from "./Location";
import { SensorType } from "./SensorType";
import { Unit } from "./Unit";

export interface Sensor {
    id: number;
    serialNumber: string;
    type: SensorType;
    location: Location;
    unit: Unit
}