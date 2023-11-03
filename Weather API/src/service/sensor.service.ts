import { SensorType } from "../domain/SensorType";
import { SensorRepository } from "../repository/sensor.repository";
import { Location } from "../domain/Location";
import {v4 as uuidv4} from 'uuid';
import { Unit } from "../domain/Unit";

export class SensorService {

    sensorRepository: SensorRepository;

    constructor() {
        this.sensorRepository = new SensorRepository();
    }

    async registerSensor(type: SensorType, location: Location, units: Unit) {
        const serialNumber = uuidv4();
        const success = await this.sensorRepository.save(type, location, serialNumber, units);

        if (success) {
            console.log('Sensor data saved successfully.');
          } else {
            console.error('Failed to save sensor data.');
        }
    }


}