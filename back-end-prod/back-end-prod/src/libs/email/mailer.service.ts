import { MailerService } from '@nestjs-modules/mailer';
import { EmailObject, IEmail } from './IEmail';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService implements IEmail {
  constructor(readonly mailerService: MailerService) {}
  async sendMail(emailObject: EmailObject): Promise<any> {
    return await this.mailerService.sendMail(emailObject);
  }
}
