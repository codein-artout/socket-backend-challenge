import { MessageBroker } from "./message-broker";
import { ReadingDispatcher } from "./reading-handlers/reading.dispatcher";
import { IncomingSensorReadingTransformer } from "./transformer/incoming-sensor-reading.transformer";

export class SensorDataConsumer {
    private readonly transformer: IncomingSensorReadingTransformer;
    private readonly readingDispatcher: ReadingDispatcher;
    private readonly messagebroker: MessageBroker;

    constructor() {
        this.transformer = new IncomingSensorReadingTransformer();
        this.readingDispatcher = new ReadingDispatcher();
        this.messagebroker = new MessageBroker();
        this.subscribe();
    }

    subscribe() {
        this.messagebroker.subscribe('Weather', (message: string) => {
            console.log('Received reading', message);
            this.consume(message)
        })
    }

    consume(reading: string) {
        const sensorReading = this.transformer.transform(reading);
        this.readingDispatcher.dispatch(sensorReading);
    }

}