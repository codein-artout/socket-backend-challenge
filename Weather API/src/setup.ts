import { Pool } from 'pg';
import pool from './repository/DB';
import { SensorService } from './service/sensor.service';
import { SensorType } from './domain/SensorType';
import { Location } from './domain/Location';
import { dbConfig } from './config/DBConfig';
import { Unit } from './domain/Unit';
import { SensorDataConsumer } from './port/sensor-data-consumer';

export class Setup {
  private pool: Pool;
  private sensorService: SensorService;
  constructor() {
    this.pool = pool;
    this.sensorService = new SensorService();
    this.createTables()
        .then(() => {
            this.registerSensors();
        })
        .catch((error) => {
        console.error('Error creating tables:', error);
        });
  }

  private async createSensorTable() {

    const client = await this.pool.connect()
    try {
      await client.query(`
      CREATE TABLE IF NOT EXISTS Sensor (
        id SERIAL PRIMARY KEY,
        type TEXT,
        serial_number TEXT UNIQUE,
        location TEXT,
        units TEXT
      );
      `);
      console.log('Sensor Table created successfully')
    } catch (error) {
      console.error('Error creating Sensor table:', error);
    } finally {
      client.release();
    }
  }

  private async createWeatherTable() {
    const client = await this.pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS Weather (
          id SERIAL PRIMARY KEY,
          sensor_id INTEGER REFERENCES Sensor(id),
          measured_at TIMESTAMPTZ DEFAULT NOW(),
          value NUMERIC
        );
      `);

      console.log('Weather table created successfully');
    } catch (error) {
      console.error('Error creating Weather table:', error);
    } finally {
      client.release();
    }
  }

  private async createTables() {
    await this.createSensorTable();
    await this.createWeatherTable();
  }

  private async registerSensors() {
    const sensors = [
        { type: 'TEMPERATURE', location: 'LONDON', units: 'CELSIUS' },
        { type: 'HUMIDITY', location: 'LONDON', units: 'PERCENTAGE' },
        { type: 'TEMPERATURE', location: 'BANGALORE', units: 'CELSIUS' },
        { type: 'HUMIDITY', location: 'BANGALORE', units: 'PERCENTAGE' },
      ];

      for (const sensor of sensors) {
        const sensorType = SensorType[sensor.type as keyof typeof SensorType];
        const sensorLocation = Location[sensor.location as keyof typeof Location];
        const units = Unit[sensor.units as keyof typeof Unit]
        await this.sensorService.registerSensor(sensorType, sensorLocation, units);
      }
  }
}