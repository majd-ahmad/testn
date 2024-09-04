import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EVENTS } from '../event-emmiter/events';
import {
  IEventEmitters,
  IEVENTEMITTERS,
} from '../event-emmiter/IEventEmitters';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(IEVENTEMITTERS) private readonly eventEmitter: IEventEmitters,
  ) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      if (params.model == 'EmailVerificationCode') {
        if (params.action === 'create') {
          this.eventEmitter.emit(EVENTS.EMAIL_VERIFY, {
            email: params.args.data.account.connect.email,
            name: `${params.args.data.account.connect.firstName} ${params.args.data.account.connect.lastName}`,
            digits: params.args.data.digits,
          });
        }
      }

      return next(params);
    });
  }
}
