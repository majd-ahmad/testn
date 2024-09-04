// FileExtensionValidator.ts

import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import * as path from 'path';

@Injectable()
@ValidatorConstraint({ name: 'isFileExtension', async: false })
export class PdfFileExtensionValidator implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (!value || !value.originalname) {
      return false;
    }

    const allowedExtensions = ['.pdf'];
    const fileExtension = path.extname(value.originalname).toLowerCase();

    return allowedExtensions.includes(fileExtension);
  }

  defaultMessage(): string {
    return 'File Document must be PDF';
  }
}

export function IsPdfFileExtension(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PdfFileExtensionValidator,
    });
  };
}
