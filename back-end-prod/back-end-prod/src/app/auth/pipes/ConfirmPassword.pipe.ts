// reset-password.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PasswordService } from 'src/libs/passwords.service';
import { AccountService } from '../../account/application/account.service';
import { CreateAccountDto } from '../../account/application/model/createAccount.dto';

@Injectable()
export class ConfirmPasswordPipe implements PipeTransform<any> {
  constructor(
    readonly passwordService: PasswordService,
    readonly accountService: AccountService,
  ) {}
  async transform(value: any): Promise<CreateAccountDto> {
    const createAccountDto = plainToClass(CreateAccountDto, value);

    const errors = await validate(createAccountDto, {
      skipMissingProperties: true,
    });
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    if (createAccountDto.password !== createAccountDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    return createAccountDto;
  }
}
