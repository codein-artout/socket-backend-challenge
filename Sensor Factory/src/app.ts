import { createClient } from 'redis';
import { redisConfig } from "./config/RedisConfig";
import { SimulatedSensorData } from './SimulatedSensorData';

const sensorData = new SimulatedSensorData();


const client = createClient(redisConfig);
client.connect();
client.on('connect', () => {
    console.log('Connected to Redis');
    setInterval(() => {
        publishData();
    }, 5000);
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

function publishData(): void {
    const londonTemperature = sensorData.generateLondonTemperatureData();
    client.publish('Weather', JSON.stringify(londonTemperature));
    const londonHumidity = sensorData.generateLondonHumidityData();
    client.publish('Weather', JSON.stringify(londonHumidity));
    const bangaloreTemperature = sensorData.generateBangaloreTemperatureData();
    client.publish('Weather', JSON.stringify(bangaloreTemperature));
    const bangaloreHumidity = sensorData.generateBangaloreHumidityData();
    client.publish('Weather', JSON.stringify(bangaloreHumidity));
}


