import { SensorType } from '../domain/SensorType';
import  pool from './DB';
import { Location } from '../domain/Location';
import { Pool } from 'pg';

export class SensorRepository {
    pool: Pool;

    constructor() {
        this.pool = pool;
    }

    public async save(type: SensorType, location: Location, serialNumber: string, units: string) {
      const query = `INSERT INTO Sensor (type, location, serial_number, units) VALUES ($1, $2, $3, $4)`
      const client = await pool.connect()
      try {
        const result = await client.query(
          query,
          [type, location, serialNumber, units]
        );
        return true;
      } catch (error) {
        console.error('Error saving sensor data:', error);
        return false; // The insertion failed
      } finally {
        client.release();
      }
    }



}



