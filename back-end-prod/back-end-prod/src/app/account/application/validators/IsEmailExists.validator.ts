// EmailExistsValidator.ts

import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import {
  IAccountRepository,
  IAccountRepositoryToken,
} from '../../infrastructure/repository/IAccountRepository';

@ValidatorConstraint({ name: 'emailExists', async: true })
@Injectable()
export class IsEmailExistsValidator implements ValidatorConstraintInterface {
  constructor(
    @Inject(IAccountRepositoryToken)
    private readonly accountRepository: IAccountRepository,
  ) {}

  async validate(email: string): Promise<boolean> {
    const isEmailExist = await this.accountRepository.findOneByEmail(email);

    if (isEmailExist) return false;
    return true;
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistsValidator,
    });
  };
}
