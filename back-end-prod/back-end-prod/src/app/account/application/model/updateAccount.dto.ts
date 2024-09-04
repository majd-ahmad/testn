import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { IsPhoneNumberValid } from '../validators/IsPhoneNumberValid';
import { Currency } from '@prisma/client';

export class UpdateAccountDto {
  @IsString()
  @ApiProperty({
    required: false,
  })
  firstName: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    required: false,
  })
  lastName: string;

  @IsString()
  @ApiProperty({
    required: false,
  })
  email: string;

  @IsString()
  @IsPhoneNumberValid({ message: 'Invalid phone number' })
  @ApiProperty({
    required: false,
  })
  phoneNumber: string;

  @IsString()
  @ApiProperty({
    required: false,
  })
  country: string;

  @IsEnum(Currency)
  @ApiProperty({ required: false })
  currency: Currency;
}
