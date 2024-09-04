import { OnEvent } from '@nestjs/event-emitter';
import { EventPayload } from 'src/event-emmiter/event-payloads.interface';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { EVENTS } from 'src/event-emmiter/events';
import { IEmail, IEmailtoken } from 'src/libs/email';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendForApprovalEvent {
  constructor(
    @Inject(IEmailtoken) readonly email: IEmail,
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent(EVENTS.SEND_FOR_APPROVAL)
  async SendForApprovalEvent(
    data: EventPayload[EVENTS.SEND_FOR_APPROVAL],
  ): Promise<void> {
    try {
      const { email, listing, token } = data;
      await this.email.sendMail({
        to: email,
        subject: `Listing ${listing.title} is awaiting your approval`,
        template: 'send-for-approval',
        context: {
          listing,
          approveLink: `${this.configService.get('app.backendDomain', { infer: true })}/listings/listing/admin/approve?action=true&token=${token}`,
          denyLink: `${this.configService.get('app.backendDomain', { infer: true })}/listings/listing/admin/approve?action=false&token=${token}`,
        },
      });
      this.logger.log('Listing Approval email sent successfully', [
        `SendForApprovalEvent`,
      ]);
    } catch (error) {
      this.logger.error(
        'Failed to send Listing Approval email',
        error.stack,
        SendForApprovalEvent.name,
      );
    }
  }
}
