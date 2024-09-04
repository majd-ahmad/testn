import { Global, Module } from '@nestjs/common';
import { TypedEventEmitter } from './typed-event-emitters';
import { IEVENTEMITTERS } from './IEventEmitters';

@Global()
@Module({
  providers: [{ provide: IEVENTEMITTERS, useClass: TypedEventEmitter }],
  exports: [{ provide: IEVENTEMITTERS, useClass: TypedEventEmitter }],
})
export class TypedEventEmitterModule {}
