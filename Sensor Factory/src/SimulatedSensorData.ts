export class SimulatedSensorData {
    // For testing purposes, sensorId is hardcoded. In prod, there will be a more elegant way when riegistering sensors
    generateLondonTemperatureData(): any {
        const temperature = Math.random() * 50 + 20;
        return {
            sensor_id: 1,
            type: 'TEMPERATURE',
            value: temperature,
            measured_at: new Date(),
        };
    }

    generateBangaloreTemperatureData(): any {
        const temperature = Math.random() * 50 + 20;
        return {
            sensor_id: 3,
            type: 'TEMPERATURE',
            value: temperature,
            measured_at: new Date(),
        };
    }

    generateLondonHumidityData(): any {
        const humidity = Math.random() * 100;
        return {
            sensor_id: 2,
            type: 'HUMIDITY',
            value: humidity,
            measured_at: new Date(),
        };
    }

    generateBangaloreHumidityData(): any {
        const humidity = Math.random() * 100;
        return {
            sensor_id: 4,
            type: 'HUMIDITY',
            value: humidity,
            measured_at: new Date(),
        };
    }

}