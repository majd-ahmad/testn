import { OnEvent } from '@nestjs/event-emitter';
import { EventPayload } from 'src/event-emmiter/event-payloads.interface';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { EVENTS } from 'src/event-emmiter/events';
import { IEmail, IEmailtoken } from 'src/libs/email';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class AccountRegisteredEvent {
  constructor(
    @Inject(IEmailtoken) readonly email: IEmail,
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @OnEvent(EVENTS.ACCOUNT_CREATED)
  async welcomeAccount(
    data: EventPayload[EVENTS.ACCOUNT_CREATED],
  ): Promise<void> {
    try {
      const { email, name } = data;

      await this.email.sendMail({
        to: email,
        subject: 'Welcome to connect to invest',
        template: 'welcome',
        context: {
          name,
          link: `${this.configService.get('app.frontendDomain', { infer: true })}/profile`,
        },
      });
      this.logger.log('Account | Event | Welcome email sent successfully', [
        `AccountRegisteredEvent`,
      ]);
    } catch (error) {
      this.logger.error(
        'Account | Event | Failed to sent welcome email',
        error.stack,
        AccountRegisteredEvent.name,
      );
    }
  }
}
