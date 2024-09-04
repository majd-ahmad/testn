// FileExtensionValidator.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import * as path from 'path';

@Injectable()
@ValidatorConstraint({ name: 'isFileExtension', async: false })
export class ImageFileExtensionValidator
  implements ValidatorConstraintInterface
{
  validate(value: any): boolean {
    if (!value || !value.originalname) {
      return false;
    }
    const allowedExtensions = ['.jpg', '.png', '.jpeg'];
    const fileExtension = path.extname(value.originalname).toLowerCase();

    const isFileExtensionValid = allowedExtensions.includes(fileExtension);
    if (!isFileExtensionValid) {
      throw new BadRequestException(
        'File must be JPG, JPEG, PNG and not larger than 100KB',
      );
    }
  }

  defaultMessage(): string {
    return 'File must be JPG, JPEG, PNG and not larger than 100KB';
  }
}

export function IsImageFileExtension(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ImageFileExtensionValidator,
    });
  };
}
