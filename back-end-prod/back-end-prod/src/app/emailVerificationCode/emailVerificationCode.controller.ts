import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AccountService } from '../account/application/account.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { EmailVerificationCodeService } from './emailVerificationCode.service';
import {
  IEventEmitters,
  IEVENTEMITTERS,
} from 'src/event-emmiter/IEventEmitters';
import { CodeValidationPipe } from "./pipes/CodeValidation.pipe";
import { VerifyCodeDto } from './dto/verify-code.dto';
import { generateSixDigitCode } from 'src/utils/one-time-code';

@ApiTags('Email Verification Code')
@Controller('emailVerificationCode')
export class EmailVerificationCodeController {
  constructor(
    @Inject(IEVENTEMITTERS) private readonly eventEmitter: IEventEmitters,
    readonly accountService: AccountService,
    readonly emailVerificationCodeService: EmailVerificationCodeService,
  ) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post('send')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendVerificationCodeEmail(@CurrentUser('id') currentUserId: string) {
    const currentUserAccount = await this.accountService.findAccountById(currentUserId);
    await this.emailVerificationCodeService.createEmailVerificationCode({
      digits: generateSixDigitCode(6),
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
      used: false,
      account: {
        connect: {
          id: currentUserId,
          email: currentUserAccount.email,
          firstName: currentUserAccount.firstName,
          lastName: currentUserAccount.lastName,
        },
      },
    });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post('verify')
  @ApiBody({ type: VerifyCodeDto })
  @UsePipes(CodeValidationPipe)
  async verifyCode(
    @CurrentUser('id') currentUserId,
    @Body() verifyCodeDTO: VerifyCodeDto,
  ): Promise<void> {
    console.log('verifyCodeDTO', verifyCodeDTO);
    await this.accountService.verifyAccountByCode(currentUserId);
    await this.emailVerificationCodeService.setEmailVerificationCodeUsed(currentUserId);
  }
}
