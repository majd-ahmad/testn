import { EventPayload } from './event-payloads.interface';

export interface IEventEmitters {
  emit<K extends keyof EventPayload>(
    event: K,
    payload: EventPayload[K],
  ): boolean;
}

export const IEVENTEMITTERS = Symbol('IEventEmitters');
