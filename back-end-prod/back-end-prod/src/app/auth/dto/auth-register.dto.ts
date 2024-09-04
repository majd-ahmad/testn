import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsEmailAlreadyExist } from 'src/app/account/application/validators/IsEmailExists.validator';
import { IsPhoneNumberValid } from 'src/app/account/application/validators/IsPhoneNumberValid';

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'Email already exists' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumberValid({ message: 'Invalid phone number' })
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  confirmPassword: string;
}
