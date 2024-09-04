import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { EmailVerificationCodeService } from './emailVerificationCode.service';
import { EmailVerificationCodeController } from './emailVerificationCode.controller';
import { AccountModule } from '../account/account.module';
import { VerifyEmailEvent } from './events/verifyEmail.event';
import { EmailModule, EmailService, IEmailtoken } from '../../libs/email';

const events = [VerifyEmailEvent];
@Module({
  imports: [DatabaseModule, AccountModule, EmailModule],
  controllers: [EmailVerificationCodeController],
  providers: [
    ...events,
    EmailVerificationCodeService,
    { provide: IEmailtoken, useClass: EmailService },
    Logger,
  ],
  exports: [EmailVerificationCodeService],
})
export class EmailVerificationCodeModule {}
