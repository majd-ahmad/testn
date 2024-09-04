import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { PasswordService } from 'src/libs/passwords.service';

@ValidatorConstraint({ name: 'WrongPhoneNumber', async: true })
@Injectable()
export class IsUAEPhoneNumberValidator implements ValidatorConstraintInterface {
  constructor(protected readonly passwordService: PasswordService) {}

  async validate(phoneNumber: string): Promise<boolean> {
    // UAE phone numbers start with "+971" and have 9 digits afterwards
    const re = /^\+971[0-9]{9}$/;
    const isValidPhoneNumber = re.test(phoneNumber);
    try {
      if (!isValidPhoneNumber) return false;
      return true;
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Invalid phone number!');
    }
  }
}

export function IsPhoneNumberValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUAEPhoneNumberValidator,
    });
  };
}
