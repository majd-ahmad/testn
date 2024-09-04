import {
  PipeTransform,
  Injectable,
  HttpException,
  HttpStatus,
  Scope,
  Inject,
} from '@nestjs/common';
import { EmailVerificationCodeService } from '../emailVerificationCode.service';
import { VerifyCodeDto } from '../dto/verify-code.dto';
import { isCodeStillValid } from '../../../utils/one-time-code';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class CodeValidationPipe implements PipeTransform {
  constructor(
    private readonly emailVerificationCodeService: EmailVerificationCodeService,
    @Inject(REQUEST) protected readonly request: Request,
  ) { }

  async transform(verifyCodeDTO: VerifyCodeDto) {
    const currentUserId = this.request['user'].id;
    const latestCode =
      await this.emailVerificationCodeService.getLatestByAccountId(
        currentUserId,
      );
    console.log('latestCode', latestCode)
    if (!latestCode) {
      throw new HttpException(
        'Invalid verification code. Recheck your verification code.',
        HttpStatus.FORBIDDEN,
      );
    }
    if (latestCode.used) {
      throw new HttpException(
        'Verification code already used. Generate a new one.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!isCodeStillValid(latestCode.createdAt)) {
      throw new HttpException(
        'Expired verification code. Generate a new one.',
        HttpStatus.GONE,
      );
    }

    if (verifyCodeDTO.code && latestCode.digits != verifyCodeDTO.code) {
      throw new HttpException(
        'Invalid verification code. Recheck your verification code.',
        HttpStatus.FORBIDDEN,
      );
    }
    return verifyCodeDTO;
  }
}
