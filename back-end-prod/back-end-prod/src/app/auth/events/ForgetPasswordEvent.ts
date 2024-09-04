import { OnEvent } from '@nestjs/event-emitter';
import { EventPayload } from 'src/event-emmiter/event-payloads.interface';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { EVENTS } from 'src/event-emmiter/events';
import { IEmail, IEmailtoken } from 'src/libs/email';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class ForgetPasswordEvent {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @Inject(IEmailtoken) readonly email: IEmail,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}

  @OnEvent(EVENTS.ACCOUNT_PASSWORD_FORGET)
  async passwordForget(
    data: EventPayload[EVENTS.ACCOUNT_PASSWORD_FORGET],
  ): Promise<void> {
    try {
      const { email, name, token } = data;
      await this.email.sendMail({
        to: email,
        subject: 'Reset your password!',
        template: 'forget-password',
        context: {
          link: `${this.configService.get('app.frontendDomain', { infer: true })}/resetPassword?token=${token}`,
          name,
        },
      });
      this.logger.log(
        'Account | Event | Forget password email sent successfully',
        [`ForgetPasswordEvent`],
      );
    } catch (error) {
      this.logger.error(
        'Account | Event | Failed to sent forget password email',
        error.stack,
        ForgetPasswordEvent.name,
      );
    }
  }
}
