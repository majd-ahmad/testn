// EmailExistsValidator.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { PasswordService } from 'src/libs/passwords.service';

@ValidatorConstraint({ name: 'weakPassword', async: true })
@Injectable()
export class IsPasswordStrongValidator implements ValidatorConstraintInterface {
  constructor(protected readonly passwordService: PasswordService) {}

  async validate(password: string): Promise<boolean> {
    try {
      const isPasswordStrong = this.passwordService.isPasswordStrong(password);
      if (!isPasswordStrong) return false;
      return true;
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Password is weak!');
    }
  }

  defaultMessage() {
    return 'Password is weak!';
  }
}

export function IsPasswordStrong(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordStrongValidator,
    });
  };
}
