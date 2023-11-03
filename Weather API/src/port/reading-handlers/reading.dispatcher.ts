import { ReadingHandler } from "./reading.handler";
import { IncomingSensorReading } from "../../domain/IncomingSensorReading";
import { SensorType } from "../../domain/SensorType";
import { TemperatureReadingHandler } from "./temperature-reading.handler";
import { HumidityReadingHandler } from "./humidity-reading.handler";

export class ReadingDispatcher {
  private handlers: Map<SensorType, ReadingHandler> = new Map();

  constructor() {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    // Does typescript has a cleaner way of implementing handler pattern?
    
    const temperatureHandler = new TemperatureReadingHandler();
    const humidityHandler = new HumidityReadingHandler();
    this.handlers.set(temperatureHandler.handles(), temperatureHandler);
    this.handlers.set(humidityHandler.handles(), humidityHandler);
  }

  dispatch(reading: IncomingSensorReading): void {
    const sensorType = reading.type;
    const handler = this.handlers.get(sensorType);

    if (handler) {
      handler.process(reading);
    } else {
      console.log(`No handler registered for SensorType: ${sensorType}`);
    }
  }
}
