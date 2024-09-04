import { CreateAccountDto } from '../../application/model/createAccount.dto';
import { UpdateAccountDto } from '../../application/model/updateAccount.dto';
import { AccountDomain } from '../../domain/account';
import { Account, Prisma } from "@prisma/client";

export interface IAccountRepository {
  getAccounts(params?: { include: Prisma.AccountInclude }): Promise<AccountDomain[]>;
  createAccount(createAccountDto: CreateAccountDto): Promise<AccountDomain>;
  findOneById(id: string): Promise<Account>;
  findOneByEmail(id: string): Promise<Account>;

  updateValidity(id: string, isValid: boolean): Promise<AccountDomain>;
  verifyAccountByCode(id: string): Promise<AccountDomain>;
  updateProfile(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDomain>;
  updatePassword(id: string, newPassword: string): Promise<void>;
  getAccountById(id: string, params?: { include: Prisma.AccountInclude }): Promise<AccountDomain>;
}

export const IAccountRepositoryToken = Symbol('IAccountRepository');
