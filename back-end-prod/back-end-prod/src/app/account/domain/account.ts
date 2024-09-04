import { Exclude } from 'class-transformer';
import { AccountProfilePicture, Currency, Role } from '@prisma/client';
import { IAccount } from '../application/model/account';

export class AccountDomain implements IAccount {
  id: string;
  email: string | null;
  @Exclude({ toPlainOnly: true })
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isApproved: boolean;
  isValid: boolean;
  role: Role[];
  country: string;
  currency: Currency;
  location: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  accountProfilePicture: AccountProfilePicture;
}
