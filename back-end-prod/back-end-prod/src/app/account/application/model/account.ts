import { ApiProperty } from '@nestjs/swagger';
import { AccountDomain } from '../../domain/account';
import { AccountProfilePicture, Currency } from '@prisma/client';
import { getImageFileLink } from "../../../../utils/FileHelpers";

export interface IAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  currency: Currency;
  isValid: boolean;
  accountProfilePicture: AccountProfilePicture
}
export class AccountModel implements IAccount {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly phoneNumber: string;

  @ApiProperty()
  readonly country: string;

  @ApiProperty()
  readonly currency: Currency;

  @ApiProperty()
  readonly isValid: boolean;

  @ApiProperty()
  readonly accountProfilePicture: AccountProfilePicture;

  constructor(data: IAccount) {
    Object.assign(this, data);
  }

  static fromDomain(accountDomain: AccountDomain): AccountModel {
    const accountProfilePicture = accountDomain.accountProfilePicture ? { ...accountDomain.accountProfilePicture, url: getImageFileLink(accountDomain.accountProfilePicture.fileName) } : accountDomain.accountProfilePicture;
    return new AccountModel({
      ...accountDomain,
      accountProfilePicture,
    });
  }
}
