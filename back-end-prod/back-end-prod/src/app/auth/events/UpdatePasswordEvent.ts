import { OnEvent } from '@nestjs/event-emitter';
import { EventPayload } from 'src/event-emmiter/event-payloads.interface';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { EVENTS } from 'src/event-emmiter/events';
import { IEmail, IEmailtoken } from 'src/libs/email';

@Injectable()
export class UpdatePasswordEvent {
  constructor(
    @Inject(IEmailtoken) readonly email: IEmail,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) { }

  @OnEvent(EVENTS.ACCOUNT_PASSWORD_RESET)
  async resetPassword(
    data: EventPayload[EVENTS.ACCOUNT_PASSWORD_RESET],
  ): Promise<void> {
    try {
      const { email } = data;
      await this.email.sendMail({
        to: email,
        subject: 'Password Change Confirmation',
        template: 'password-reset',
        context: {},
      });
      this.logger.log(
        'Account | Event | update password email sent successfully',
        [`UpdatePasswordEvent`],
      );
    } catch (error) {
      this.logger.error(
        'Account | Event | Failed to sent update password email',
        error.stack,
        UpdatePasswordEvent.name,
      );
    }
  }
}
