import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsPasswordStrong } from '../validators/IsPasswordStrong.validator';
import { IsPhoneNumberValid } from '../validators/IsPhoneNumberValid';
import { IsEmailAlreadyExist } from '../validators/IsEmailExists.validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmailAlreadyExist({ message: 'Email already exists' })
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumberValid({ message: 'Invalid phone number' })
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsPasswordStrong({
    message: 'Password is week!',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  confirmPassword: string;
}
