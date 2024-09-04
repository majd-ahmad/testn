import { OnEvent } from '@nestjs/event-emitter';
import { EventPayload } from 'src/event-emmiter/event-payloads.interface';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { EVENTS } from 'src/event-emmiter/events';
import { IEmail, IEmailtoken } from 'src/libs/email';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BusinessProfileSubmittedEvent {
  constructor(
    @Inject(IEmailtoken) readonly email: IEmail,
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent(EVENTS.BUSINESS_PROFILE_SUBMITTED)
  async BusinessProfileSubmittedEvent(
    data: EventPayload[EVENTS.BUSINESS_PROFILE_SUBMITTED],
  ): Promise<void> {
    try {
      console.log('BusinessProfileSubmittedEvent', data)
      const { email, name, businessName, businessId } = data;
      await this.email.sendMail({
        to: email,
        subject: `Business Profile ${businessName} is submitted`,
        template: 'business-submitted',
        context: {
          name,
          businessName,
          businessId,
          link: `${this.configService.get('app.frontendDomain', { infer: true })}}/sellers/${businessId}`
        },
      });
      this.logger.log('Business Profile Submitted email sent successfully', [
        `BusinessProfileSubmittedEvent`,
      ]);
    } catch (error) {
      this.logger.error(
        'Failed to send Business Profile Submitted email',
        error.stack,
        BusinessProfileSubmittedEvent.name,
      );
    }
  }
}