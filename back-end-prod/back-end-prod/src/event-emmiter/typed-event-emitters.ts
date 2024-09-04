import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPayload } from './event-payloads.interface';
import { IEventEmitters } from './IEventEmitters';

@Injectable()
export class TypedEventEmitter implements IEventEmitters {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<K extends keyof EventPayload>(
    event: K,
    payload: EventPayload[K],
  ): boolean {
    console.log(event, payload);
    return this.eventEmitter.emit(event, payload);
  }
}
