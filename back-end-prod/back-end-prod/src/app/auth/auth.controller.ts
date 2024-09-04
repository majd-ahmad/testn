import {
  Controller,
  HttpStatus,
  Post,
  HttpCode,
  Body,
  UsePipes,
  BadRequestException,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthForgotPasswordDto } from './dto/auth-forget-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { ConfirmPasswordPipe } from './pipes/ConfirmPassword.pipe';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { AccountService } from '../account/application/account.service';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly accountService: AccountService,
  ) { }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.service.validateLogin(loginDto);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ConfirmPasswordPipe)
  async register(@Body() createUserDto: AuthRegisterDto): Promise<LoginResponseType> {
    try {
      return this.service.register(createUserDto);
    } catch (error) {
      throw new BadRequestException(
        'Cannot register user, account already exist',
      );
    }
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ConfirmPasswordPipe)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }
}
