import { RedisClientType, createClient } from 'redis';
import { redisConfig } from '../config/RedisConfig';

export class MessageBroker {
    private readonly client: RedisClientType

    constructor() {
        this.client = createClient(redisConfig);
        this.client.connect();
        this.client.on('connect', () => {
            console.log('Connected to Redis');
        });
    }

    subscribe(channel: string, messageHandler: (message: string) => void): void {
        this.client.subscribe(channel, (message) => {
            messageHandler(message)
        });
    }

}

