import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  IAccountRepository,
  IAccountRepositoryToken,
} from '../infrastructure/repository/IAccountRepository';
import { AccountModel } from './model/account';
import { CreateAccountDto } from './model/createAccount.dto';
import { PasswordService } from 'src/libs/passwords.service';
import { UpdateAccountDto } from './model/updateAccount.dto';
import { UpdatePasswordDto } from './model/updatePassword.dto';
import { Prisma } from '@prisma/client';
import { GenericMapper } from '../../../utils/GenericMapper';
import { AccountDomain } from '../domain/account';
import { EVENTS } from 'src/event-emmiter/events';
import { IEVENTEMITTERS, IEventEmitters } from 'src/event-emmiter/IEventEmitters';

@Injectable()
export class AccountService {
  constructor(
    @Inject(IEVENTEMITTERS) private readonly eventEmitter: IEventEmitters,
    @Inject(IAccountRepositoryToken) readonly accountRepo: IAccountRepository,
    @Inject(PasswordService) readonly passwordService: PasswordService,
  ) {}

  async getAllAccounts(params?: {
    include: Prisma.AccountInclude;
  }): Promise<AccountModel[]> {
    return (await this.accountRepo.getAccounts(params)).map((account) =>
      AccountModel.fromDomain(
        GenericMapper.mapPrismaEntityToDomain(account, AccountDomain),
      ),
    );
  }
  async registerAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<AccountModel> {
    const isAccountExists = await this.isAccountAlreadyExists(
      createAccountDto.email,
    );
    if (isAccountExists) {
      throw new BadRequestException('Account already exists');
    }
    const savedAccount = await this.accountRepo.createAccount({
      password: await this.passwordService.hashPassword(
        createAccountDto.password,
      ),
      ...createAccountDto,
    });

    return AccountModel.fromDomain(savedAccount);
  }

  async findAccountById(id: string): Promise<AccountModel | null> {
    const account = await this.accountRepo.findOneById(id);
    if (!account) {
      return null;
    }
    return AccountModel.fromDomain(
      GenericMapper.mapPrismaEntityToDomain(account, AccountDomain),
    );
  }

  async findAccountByEmail(
    email: string,
  ): Promise<{ account: AccountModel; password?: string } | null> {
    const account = await this.accountRepo.findOneByEmail(email);
    if (!account) {
      return null;
    }
    return {
      account: AccountModel.fromDomain(
        GenericMapper.mapPrismaEntityToDomain(account, AccountDomain),
      ),
      password: account.password,
    };
  }

  async updateAccountValidity(
    id: string,
    isValid: boolean,
  ): Promise<AccountModel> {
    const updatedAccount = await this.accountRepo.updateValidity(id, isValid);
    return AccountModel.fromDomain(updatedAccount);
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await this.accountRepo.updatePassword(
      id,
      await this.passwordService.hashPassword(newPassword),
    );
  }

  async verifyAccountByCode(currentUserId) : Promise<AccountDomain>{
    const updatedAccount = await this.accountRepo.verifyAccountByCode(currentUserId);
    this.eventEmitter.emit(EVENTS.ACCOUNT_CREATED, {
      email: updatedAccount.email,
      name: `${updatedAccount.firstName} ${updatedAccount.lastName}`,
    });
    return updatedAccount;
  }

  async updateProfile(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountModel> {
    const currentAccount = await this.accountRepo.getAccountById(id);

    if (updateAccountDto.email !== currentAccount.email) {
      this.updateAccountValidity(id, false);
    }

    const updatedAccount = await this.accountRepo.updateProfile(
      id,
      updateAccountDto,
    );
    return AccountModel.fromDomain(updatedAccount);
  }

  async updateAccountPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const { currentPassword, password } = updatePasswordDto;
    const account = await this.accountRepo.findOneById(id);
    const isPasswordValid = await this.passwordService.comparePasswords(
      currentPassword,
      account.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid current password');
    }
    await this.accountRepo.updatePassword(
      id,
      await this.passwordService.hashPassword(password),
    );
  }

  async getAccountById(id: string, params?): Promise<AccountModel> {
    const account = await this.accountRepo.getAccountById(id, params);
    if (!account) {
      return null;
    }
    return AccountModel.fromDomain(account);
  }

  private async isAccountAlreadyExists(email: string): Promise<boolean> {
    const account = await this.accountRepo.findOneByEmail(email);
    return account !== null;
  }
}
