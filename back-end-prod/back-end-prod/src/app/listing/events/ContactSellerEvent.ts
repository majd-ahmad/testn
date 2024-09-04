import { OnEvent } from '@nestjs/event-emitter';
import { EventPayload } from 'src/event-emmiter/event-payloads.interface';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { EVENTS } from 'src/event-emmiter/events';
import { IEmail, IEmailtoken } from 'src/libs/email';

@Injectable()
export class ContactSellerEvent {
  constructor(
    @Inject(IEmailtoken) readonly email: IEmail,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {}

  @OnEvent(EVENTS.SELLER_CONTACT)
  async contactSeller(
    data: EventPayload[EVENTS.SELLER_CONTACT],
  ): Promise<void> {
    try {
      const { email, name, owner, listing } = data;

      await this.email.sendMail({
        to: email,
        subject: `Listing Unlocked - ${listing.title}`,
        template: 'seller-contact-info',
        context: {
          name,
          owner,
          listing,
        },
      });
      this.logger.log('Seller contact email sent successfully', [
        `ContactSellerEvent`,
      ]);
    } catch (error) {
      this.logger.error(
        'Failed to sent seller contact info email',
        error.stack,
        ContactSellerEvent.name,
      );
    }
  }
}
