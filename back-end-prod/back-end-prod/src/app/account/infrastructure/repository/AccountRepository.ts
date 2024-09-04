import { IAccountRepository } from './IAccountRepository';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../database/database.service';
import { AccountDomain } from '../../domain/account';
import { Account, Prisma } from '@prisma/client';
import { GenericMapper } from '../../../../utils/GenericMapper';
import { CreateAccountDto } from '../../application/model/createAccount.dto';
import { UpdateAccountDto } from '../../application/model/updateAccount.dto';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(private db: DatabaseService) { }
  async updateProfile(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDomain> {
    const { firstName, lastName, phoneNumber, email, country, currency } =
      updateAccountDto;
    const updatedAccount = await this.db.account.update({
      where: { id: id },
      data: {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        currency: currency,
        country: country,
      },
    });
    return GenericMapper.mapPrismaEntityToDomain(updatedAccount, AccountDomain);
  }
  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.db.account.update({
      where: { id: id },
      data: {
        password: newPassword,
      },
    });
  }
  async updateValidity(id: string, isValid: boolean): Promise<AccountDomain> {
    const updatedAccount = await this.db.account.update({
      where: { id: id },
      data: {
        isValid,
      },
    });

    return GenericMapper.mapPrismaEntityToDomain(updatedAccount, AccountDomain);
  }
  async verifyAccountByCode(id: string): Promise<AccountDomain> {
    return await this.updateValidity(id, true)
  }
  async findOneById(id: string): Promise<Account> {
    return await this.db.account.findFirst({
      where: { id: id },
    });
  }

  async findOneByEmail(email: string): Promise<Account> {
    return await this.db.account.findFirst({
      where: { email: email },
    });
  }

  async createAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<AccountDomain> {
    const { email, password, phoneNumber, firstName, lastName } =
      createAccountDto;
    const savedAccount = await this.db.account.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        phoneNumber: phoneNumber,
      },
    });
    return GenericMapper.mapPrismaEntityToDomain(savedAccount, AccountDomain);
  }

  async getAccounts(params: { include: Prisma.AccountInclude } = { include: {} }): Promise<AccountDomain[]> {
    const { include } = params;
    const accounts: Account[] = await this.db.account.findMany({
      include
    });
    return accounts.map((account) =>
      GenericMapper.mapPrismaEntityToDomain(account, AccountDomain),
    );
  }

  async getAccountById(id: string, params: { include: Prisma.AccountInclude } = { include: {} }): Promise<AccountDomain> {
    const { include } = params;
    const account = await this.db.account.findUnique({
      where: { id: id },
      include
    });
    return GenericMapper.mapPrismaEntityToDomain(account, AccountDomain);
  }
}
