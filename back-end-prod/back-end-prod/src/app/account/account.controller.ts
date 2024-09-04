import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
  UsePipes,
  Param,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './application/account.service';
import { AccountModel } from './application/model/account';
import {ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags} from '@nestjs/swagger';
import { UpdateAccountDto } from './application/model/updateAccount.dto';
import { ConfirmPasswordPipe } from '../auth/pipes/ConfirmPassword.pipe';
import { UpdatePasswordDto } from './application/model/updatePassword.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
  constructor(readonly accountService: AccountService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Get()
  @ApiOkResponse({ type: AccountModel, isArray: true })
  async fetchAccounts(): Promise<AccountModel[]> {
    try {
      return await this.accountService.getAllAccounts({
        include: {
            accountProfilePicture: true
        }
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Patch('/update/profile')
  @ApiOkResponse({ type: AccountModel })
  async updateProfile(
    @Body() updateAccountDto: UpdateAccountDto,
    @CurrentUser() currentUser,
  ): Promise<AccountModel> {
    try {
      return await this.accountService.updateProfile(
        currentUser.id,
        updateAccountDto,
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Put('/update/password')
  @UsePipes(ConfirmPasswordPipe)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() currentUser,
  ): Promise<void> {
    try {
      return await this.accountService.updateAccountPassword(
        currentUser.id,
        updatePasswordDto,
      );
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Get('/:accountId')
  @ApiParam({ name: 'accountId', type: 'string' })
  @ApiOkResponse({ type: AccountModel })
  async getAccountById(
    @Param() param: { accountId: string },
  ): Promise<AccountModel> {
    try {
      return await this.accountService.getAccountById(param.accountId, {include: {
          accountProfilePicture: true
        }});
    } catch (error) {
      throw new NotFoundException('No account with the provided information');
    }
  }
}
