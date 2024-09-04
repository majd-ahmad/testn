import { Module } from '@nestjs/common';
import { IAccountRepositoryToken } from './infrastructure/repository/IAccountRepository';
import { AccountRepository } from './infrastructure/repository/AccountRepository';
import { DatabaseModule } from '../../database/database.module';
import { AccountService } from './application/account.service';
import { AccountController } from './account.controller';
import { PasswordService } from '../../libs/passwords.service';
import { IsPasswordStrongValidator } from './application/validators/IsPasswordStrong.validator';
import { IsEmailExistsValidator } from './application/validators/IsEmailExists.validator';
import { IsUAEPhoneNumberValidator } from './application/validators/IsPhoneNumberValid';
import { IBuyerRepositoryToken } from './infrastructure/repository/buyer/IBuyerRepository';
import { BuyerRepository } from './infrastructure/repository/buyer/BuyerRepository';
import { BuyerService } from './application/buyer.service';
import { BuyerController } from './buyer.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountController, BuyerController],
  providers: [
    AccountService,
    BuyerService,
    PasswordService,
    IsPasswordStrongValidator,
    IsEmailExistsValidator,
    IsUAEPhoneNumberValidator,
    {
      provide: IAccountRepositoryToken,
      useClass: AccountRepository,
    },
    {
      provide: IBuyerRepositoryToken,
      useClass: BuyerRepository,
    },
  ],
  exports: [
    AccountService,
    BuyerService,
    {
      provide: IAccountRepositoryToken,
      useClass: AccountRepository,
    },
    {
      provide: IBuyerRepositoryToken,
      useClass: BuyerRepository,
    },
  ],
})
export class AccountModule { }
