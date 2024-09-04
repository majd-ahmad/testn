import { OnEvent } from '@nestjs/event-emitter';
import { EventPayload } from 'src/event-emmiter/event-payloads.interface';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { EVENTS } from 'src/event-emmiter/events';
import { IEmail, IEmailtoken } from 'src/libs/email';

@Injectable()
export class VerifyEmailEvent {
  constructor(
    @Inject(IEmailtoken) readonly email: IEmail,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}

  @OnEvent(EVENTS.EMAIL_VERIFY)
  async verifyEmail(data: EventPayload[EVENTS.EMAIL_VERIFY]): Promise<void> {
    try {
      const { email, name, digits } = data;
      await this.email.sendMail({
        to: email,
        subject: 'Verification Email',
        template: 'email-verify',
        context: {
          name,
          digits,
        },
      });
      this.logger.log('Verify Email sent successfully', [`verifyEmailEvent`]);
    } catch (error) {
      this.logger.error(
        'Verify Email Failed to sent welcome email',
        error.stack,
        VerifyEmailEvent.name,
      );
    }
  }
}
